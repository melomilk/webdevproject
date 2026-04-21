from rest_framework.permissions import BasePermission


class IsManager(BasePermission):
    """Allow access only to users with the 'manager' role."""
    
    def has_permission(self, request, view):
        # Must be logged in AND have a profile with role='manager'
        if not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'profile') and request.user.profile.role == 'manager'


class IsMaster(BasePermission):
    """Allow access only to users with the 'master' role."""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'profile') and request.user.profile.role == 'master'