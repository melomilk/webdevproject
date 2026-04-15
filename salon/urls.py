from django.urls import path
from salon.views import ServiceListView, MasterListView, gallery_list, bookings, reviews

urlpatterns = [
    path('services/', ServiceListView.as_view()),
    path('masters/', MasterListView.as_view()),
    path('gallery/', gallery_list),
    path('bookings/', bookings),
    path('reviews/', reviews),
    path('bookings/<int:pk>/', bookings),
]