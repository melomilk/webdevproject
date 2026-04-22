from rest_framework import serializers
from .models import Service, Master, Gallery, Booking, Review
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# ModelSerializers (automatically generates fields from the model)
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class MasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Master
        fields = ['id', 'name', 'specialty', 'bio', 'photo']
        read_only_fields = ['id']


class BookingSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True) 
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


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims to the token
        token['username'] = user.username
        token['role'] = user.profile.role
        
        return token
    
class MyMasterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Master
        fields = ['id', 'name', 'specialty', 'bio', 'photo']
        read_only_fields = ['id']