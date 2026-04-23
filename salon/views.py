from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Service, Master, Gallery, Booking, Review
from .permissions import IsManager, IsMaster
from .serializers import (
    ServiceSerializer, MasterSerializer,
    GallerySerializer, BookingSerializer, ReviewSerializer,
    MyTokenObtainPairSerializer,
    MyMasterProfileSerializer,
)


# CLASS-BASED VIEWS
class ServiceListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get('category')
        if category:
            services = Service.objects.filter(category=category)
        else:
            services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)


class MasterListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        masters = Master.objects.all()
        serializer = MasterSerializer(masters, many=True)
        return Response(serializer.data)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# FUNCTION-BASED VIEWS
@api_view(['GET'])
def hello_api(request):
    return Response({"message": "Django and Angular are connected!"})


@api_view(['GET'])
@permission_classes([AllowAny])
def gallery_list(request):
    gallery = Gallery.objects.all()
    serializer = GallerySerializer(gallery, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def bookings(request, pk=None):
    # POST (create booking) is open to everyone — customer books an appointment
    if request.method == 'POST' and pk is None:
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            if request.user.is_authenticated:
                serializer.save(user=request.user)
            else:
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Everything else (GET list, GET detail, PATCH, DELETE) requires being a manager
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    if not (hasattr(request.user, 'profile') and request.user.profile.role == 'manager'):
        return Response({"error": "Manager access required"}, status=status.HTTP_403_FORBIDDEN)
    
    # list
    if pk is None:
        if request.method == 'GET':
            all_bookings = Booking.objects.all()
            serializer = BookingSerializer(all_bookings, many=True)
            return Response(serializer.data)

    # detail
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    
    if request.method in ['PUT', 'PATCH']:
        serializer = BookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def reviews(request):
    if request.method == 'GET':
        all_reviews = Review.objects.all()
        serializer = ReviewSerializer(all_reviews, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            if request.user.is_authenticated:
                serializer.save(user=request.user, name=request.user.username)
            else:
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# MASTER-ONLY ENDPOINTS

@api_view(['GET', 'PATCH'])
@permission_classes([IsMaster])
def my_master_profile(request):
    """Мастер получает и редактирует свой профиль."""
    try:
        master = request.user.master_profile
    except Master.DoesNotExist:
        return Response(
            {"error": "No master profile linked to this user."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = MyMasterProfileSerializer(master)
        return Response(serializer.data)
    
    if request.method == 'PATCH':
        serializer = MyMasterProfileSerializer(master, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsMaster])
def my_master_bookings(request):
    """Мастер видит только свои бронирования."""
    try:
        master = request.user.master_profile
    except Master.DoesNotExist:
        return Response(
            {"error": "No master profile linked to this user."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    bookings = Booking.objects.filter(master=master)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

# GALLERY ENDPOINTS

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def gallery_list_create(request):
    """
    GET — публичный список всех работ (для всех посетителей).
    POST — только мастер может загрузить свою работу.
    """
    if request.method == 'GET':
        items = Gallery.objects.all()
        serializer = GallerySerializer(items, many=True)
        return Response(serializer.data)
    
    # POST — только мастер
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    if not (hasattr(request.user, 'profile') and request.user.profile.role == 'master'):
        return Response({"error": "Master access required"}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        master = request.user.master_profile
    except Master.DoesNotExist:
        return Response({"error": "No master profile linked"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = GallerySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(master=master)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH', 'DELETE'])
@permission_classes([IsMaster])
def gallery_item(request, pk):
    """
    PATCH — редактировать описание своей работы.
    DELETE — удалить свою работу.
    Только ВЛАДЕЛЕЦ может делать это (проверка на object level).
    """
    try:
        item = Gallery.objects.get(pk=pk)
    except Gallery.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Object-level permission: только владелец может трогать
    try:
        master = request.user.master_profile
    except Master.DoesNotExist:
        return Response({"error": "No master profile linked"}, status=status.HTTP_404_NOT_FOUND)
    
    if item.master != master:
        return Response(
            {"error": "You can only modify your own gallery items"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'PATCH':
        serializer = GallerySerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def master_gallery(request, master_id):
    """Публичный список работ конкретного мастера."""
    items = Gallery.objects.filter(master_id=master_id)
    serializer = GallerySerializer(items, many=True)
    return Response(serializer.data)