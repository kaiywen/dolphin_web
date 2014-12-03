"""
    This module defines some essential const for dolphin_web
    Note that you shouldn't change any things in this file
"""

#### Status of Queries ####
INITIAL = 0
RUNNING = 1
FINISHED = 2
FAILED = 3


#### Type of Requests ####
REQ_FOR_STATUS = 1
REQ_FOR_SECOND_STATUS = 2
REQ_FOR_CONTENT = 3


#### Type of Commands ####
SINGLE = 1
MULTIPLE = 2