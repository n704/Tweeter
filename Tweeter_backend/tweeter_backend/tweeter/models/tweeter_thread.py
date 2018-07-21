# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from tweeter.models.tweeter_message import TweeterMessage


class ValiationError(Exception):
    """Validation Exception."""

    def __init__(self, errors):
        """Take list of error messages."""
        self.errors = errors
        super(ValiationError, self).__init__(errors)


class TweeterThreadManager(models.Manager):
    """
    Manager class to TweeterThread to create and get all objects.

    Class consists of function to create and get all thread and messages.
    """

    def _validate(self, short_message, messages):
        errors = []
        is_valid = True
        if len(short_message) == 0:
            errors.append("Snippet is empty")
            is_valid = False
        elif len(short_message) > 20:
            errors.append("Snippet is above 20 charaters")
            is_valid = False
        if len(messages) == 0:
            errors.append("There are no messages")
            is_valid = False
        return is_valid, errors

    def create_thread(self, short_message, messages):
        """
        Create a new thread and add all messages.

        A list of messages are created

        @short_message snippet for the message chain
        @messages list of Messages

        @return thread object.
        """
        is_valid, errors = self._validate(short_message, messages)
        if is_valid:
            othread = self.create(short_message=short_message)
            for message in messages:
                oTweeterMessage = TweeterMessage(message=message, thread=othread)
                oTweeterMessage.save()
            return othread
        raise ValiationError(errors)

    def get_all_messages(self, thread_id):
        """
        Get all the messages of a thread.

        returns list of the tweetermessage in json format.
        @thread TweeterThread object
        """
        try:
            thread = self.get(pk=thread_id)
        except TweeterThread.DoesNotExist:
            raise Exception("Invalid thread Id")
        messages = TweeterMessage.objects.filter(thread=thread).order_by('pk')
        return [message.as_json for message in messages]


class TweeterThread(models.Model):
    """
    Thread to find twitter message chain.

    When a message is created to associated to a chain of messages.
    If message size is greater than limit messages are created are orgainsed
    together with the chain.
    """

    short_message = models.CharField(max_length=20, null=True, blank=True)

    objects = TweeterThreadManager()

    @property
    def as_json(self):
        """Json response."""
        return {
            "pk": self.pk,
            "short_message": self.short_message
        }
