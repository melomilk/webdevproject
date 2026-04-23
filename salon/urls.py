from django.urls import path
from salon.views import ServiceListView, MasterListView, gallery_list, bookings, reviews
from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_api, name='hello'),
    path('services/', ServiceListView.as_view()),
    path('masters/', MasterListView.as_view()),
    path('bookings/', bookings),
    path('reviews/', reviews),
    path('bookings/<int:pk>/', bookings),
    
    # Master endpoints
    path('master/me/', views.my_master_profile),
    path('master/bookings/', views.my_master_bookings),
    
    # Gallery endpoints
    path('gallery/', views.gallery_list_create),              # GET all, POST new (master only)
    path('gallery/<int:pk>/', views.gallery_item),            # PATCH, DELETE (owner only)
    path('masters/<int:master_id>/gallery/', views.master_gallery),  # GET gallery of specific master
]