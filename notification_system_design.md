# Notification System Design
## Stage 1
# problem
There are too many notifications and user cant see which ones are important.
### priority logic
Placement is most important, then Result, then Event.
I gave each type a number - Placement=3, Result=2, Event=1. Sort by that number first. If two notifications have same type, the one with newer timestamp comes first.
### unread
Read notification ids are stored in a Set. Anything not in that set is unread. No database used.
### new notifications coming in
Right now i sort all notifications and take top 10. 
If new ones keep coming, instead of sorting everything again we can keep the top 10 list and only check if the new notification is better than the last one in the list. If yes replace it. Saves time when there are lots of notifications.
