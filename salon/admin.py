from django.contrib import admin
from .models import Service, Master, Gallery, Booking, Review, Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    list_filter = ('role',)
    search_fields = ('user__username',)

admin.site.register(Service)
admin.site.register(Master)
admin.site.register(Gallery)
admin.site.register(Booking)
admin.site.register(Review)
