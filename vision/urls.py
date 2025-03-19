from django.urls import path
from . import views

app_name = 'vision'

urlpatterns = [
    path('', views.index, name='index'),
    path('analyze/', views.analyze_image, name='analyze_image'),
    path('gallery/', views.gallery, name='gallery'),
    path('delete/<int:image_id>/', views.delete_image, name='delete_image'),
    path('clear-gallery/', views.clear_gallery, name='clear_gallery'),
] 