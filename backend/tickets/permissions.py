from rest_framework.permissions import BasePermission


class IsTicketOwner(BasePermission):
    """
    Allows customers to access only their own tickets.
    """

    def has_object_permission(self, request, view, obj):
        return obj.customer == request.user

class IsAssignedStaff(BasePermission):
    """
    Allows only the assigned staff member to access the ticket.
    """

    def has_object_permission(self, request, view, obj):
        return obj.assigned_staff == request.user


class IsAdmin(BasePermission):
    """
    Allows only administrators.
    """

    def has_permission(self, request, view):
        return request.user.role == "admin"
    

class IsCustomer(BasePermission):

    def has_permission(self, request, view):
        return request.user.role == "customer"
    

class CanViewTicket(BasePermission):
    """
    Ticket owner, assigned staff or admin can access the ticket.
    """

    def has_object_permission(self, request, view, obj):
        return (
            obj.customer == request.user
            or obj.assigned_staff == request.user
            or request.user.role == "admin"
        )

class CanUpdateTicket(BasePermission):

    def has_object_permission(self, request, view, obj):
        return (
            obj.assigned_staff == request.user
            or request.user.role == "admin"
        )