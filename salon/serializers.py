from rest_framework import serializers
from .models import Service, Master, Gallery, Booking, Review


# ModelSerializers (automatically generates fields from the model)
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class MasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Master
        fields = '__all__'


# basic serializers (manual — more control over validation)
class BookingSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    phone = serializers.CharField(max_length=20)
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    master = serializers.PrimaryKeyRelatedField(queryset=Master.objects.all(), required=False)
    date = serializers.DateField()
    time = serializers.TimeField()

    def create(self, validated_data):
        return Booking.objects.create(**validated_data)


class ReviewSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    
    name = serializers.CharField(max_length=200)
    text = serializers.CharField()
    rating = serializers.IntegerField(min_value=1, max_value=5)

    def create(self, validated_data):
        return Review.objects.create(**validated_data)


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = '__all__'