from django.conf.urls import url

from tweeter.views import Threads, ChainMessages

urlpatterns = [
    url(
        r'^v1/messages/$',
        Threads.as_view(),
        name='tweeter_messages'
    ),
    url(
        r'^v1/thread/(?P<pk>[0-9a-z]+)/$',
        ChainMessages.as_view(),
        name='tweeter_chain_messages'
    )
]
