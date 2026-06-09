# Stage 1

## Problem
Users lose track of important notifications due to high volume.
We need to show top 'n' most important unread notifications first.

## Approach

### Priority Score Formula
Each notification gets a score based on:
1. Weight(primary factor):
   - Placement = 3 (highest)
   - Result = 2 (medium)
   - Event = 1 (lowest)

2. Recency(secondary factor):
   - Newer notifications get higher score
   - Timestamp converted to milliseconds

### Score Formula:
This ensures:
- A Placement notification always ranks above Result
- A Result notification always ranks above Event
- Within same type, newer notifications rank higher

Even though Event is newest, Placement ranks highest due to weight.

## Handling New Notifications Efficiently
To maintain top 10 efficiently as new notifications come in:
- Use a Min-Heap of size 10
- When new notification arrives, calculate its score
- If score > minimum in heap, replace minimum
- This gives O(log n) insertion vs O(n log n) full sort

## Why This Approach?
- Simple and explainable scoring
- Efficient with heap for real-time updates
- No database needed
- Easily configurable weights