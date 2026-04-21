from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Service, Master, Gallery, Booking, Review
from .permissions import IsManager
from .serializers import (
    ServiceSerializer, MasterSerializer,
    GallerySerializer, BookingSerializer, ReviewSerializer,
    MyTokenObtainPairSerializer,
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