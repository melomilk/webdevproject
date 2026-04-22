from django.db import models
from django.contrib.auth.models import User

class Service(models.Model):
    CATEGORY_CHOICES = [
        ('hair', 'Hair'),
        ('nails', 'Nails'),
        ('skin', 'Skin'),
        ('makeup', 'Makeup'),
        ('other', 'Other'),
    ]
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Master(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='master_profile'
    )
    name = models.CharField(max_length=200)
    specialty = models.CharField(max_length=200)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='masters/', blank=True, null=True)

    def __str__(self):
        return self.name


class Gallery(models.Model):
    image = models.ImageField(upload_to='gallery/')
    description = models.CharField(max_length=300, blank=True)

    def __str__(self):
        return f"Gallery image {self.id}"


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    master = models.ForeignKey(Master, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return f"{self.name} - {self.service} - {self.date}"
    
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200)
    text = models.TextField()
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.rating}★"
    
class Profile(models.Model):
    ROLE_CUSTOMER = 'customer'
    ROLE_MASTER = 'master'
    ROLE_MANAGER = 'manager'
    
    ROLE_CHOICES = [
        (ROLE_CUSTOMER, 'Customer'),
        (ROLE_MASTER, 'Master'),
        (ROLE_MANAGER, 'Manager'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_CUSTOMER)
    
    def __str__(self):
        return f"{self.user.username} ({self.role})"