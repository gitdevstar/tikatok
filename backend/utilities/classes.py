from django.views.generic import ListView


class BaseXMLExport(ListView):
    # def get_queryset(self):
    #     queryset = super(BaseXMLExportView, self).get_queryset()
    #     # ids = self.request.GET.getlist('ids', None)
    #     if ids:
    #         rturn queryset.all()

    #     return queryset

    def get(self, request, *args, **kwargs):
        response = super(BaseXMLExport, self).get(request, *args, **kwargs)
        response.content_type = 'application/xml'
        response['Content-Disposition'] = 'attachment; filename=data.xml'
        return response
