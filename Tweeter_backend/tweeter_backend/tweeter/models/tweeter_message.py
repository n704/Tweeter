# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models



class TweeterMessage(models.Model):
    """
    Messages in the twitter chain.

    Each message in tweeter is stored here.
    """

    message = models.CharField(max_length=50)
    thread = models.ForeignKey("TweeterThread")

    @property
    def as_json(self):
        """json representation of object"""
        return {
            "message": self.message,
            "pk": self.pk
        }
