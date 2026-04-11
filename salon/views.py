from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Service, Master, Gallery, Booking, Review
from .serializers import (
    ServiceSerializer, MasterSerializer,
    GallerySerializer, BookingSerializer, ReviewSerializer
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


# FUNCTION-BASED VIEWS
@api_view(['GET'])
@permission_classes([AllowAny])
def gallery_list(request):
    gallery = Gallery.objects.all()
    serializer = GallerySerializer(gallery, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def bookings(request):
    if request.method == 'GET':
        all_bookings = Booking.objects.all()
        serializer = BookingSerializer(all_bookings, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user if request.user.is_authenticated else None)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            serializer.save(user=request.user if request.user.is_authenticated else None)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)