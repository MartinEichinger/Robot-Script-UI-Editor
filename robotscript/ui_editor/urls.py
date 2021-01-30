from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("save_load", views.save_load, name="save_load"),
]
