# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

from django.http import JsonResponse
from django.views.generic import View

from tweeter.models import TweeterThread, TweeterMessage, ValiationError

class Threads(View):
    """
    Create messages for the tweeter.
    """

    def post(self, request):
        """
        Post request take input json and return message thread.

        eg:
        input data
        {
            "short_message": "hello",
            "messages": [
                "hello world"
            ]
        }
        output : {
            "data": "Successfully created"
        }
        """
        json_data = json.loads(request.body)
        short_message = json_data.get("short_message", "")
        messages = json_data.get("messages", [])
        try:
            TweeterThread.objects.create_thread(short_message, messages)
        except ValiationError as e:
            return JsonResponse({
                "errors": e.errors
            }, status=400)
        return JsonResponse({
            "data": "Successfully created"
        })

    def get(self, request):
        """
        GET all the threads.

        Returns all the threads stored in DB.

        sample output:
        {
            "items": [
                {
                    "pk": 1,
                    "short_message": "hello world"
                }
            ]
        }
        """
        threads = TweeterThread.objects.all()
        return JsonResponse({
            "items": [thread.as_json for thread in threads]
        })

class ChainMessages(View):
    """
    Return return list of chain messages.
    """
    def get(self, request, pk):
        """
        GET request to give all messages in pk thread

        sample output Successfully:
        {
            "items" : [
                {
                    "pk": 1,
                    "message": "hello world"
                }
            ]
        }
        sample output if thread is not found
        {
            "error": "Invalid thread Id"
        }
        """
        try:
            messages = TweeterThread.objects.get_all_messages(pk)
        except Exception as e:
            return JsonResponse({
                "error": str(e)
            }, status=400)
        return JsonResponse({
            "items": messages
        })
