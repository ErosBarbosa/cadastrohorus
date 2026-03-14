---
name: systematic-debugging
description: Use when debugging unexpected behavior. Guides through a 4-phase root cause process to fix bugs properly rather than treating symptoms.
---

# Systematic Debugging

## The Iron Law
**Never add code to work around a bug without first understanding the root cause.**

## The Four Phases

### Phase 1: Root Cause Investigation
1. Reproduce the bug consistently
2. Identify EXACTLY where it breaks (not generally where)
3. Collect evidence: logs, error messages, screenshots, state at time of failure

### Phase 2: Pattern Analysis
1. What changed recently?
2. What assumptions were made that might be wrong?
3. Is this a narrow bug or a symptom of a deeper issue?

### Phase 3: Hypothesis and Testing
1. Form ONE hypothesis
2. Test it minimally (don't fix multiple things at once)
3. If wrong, discard and form a new hypothesis

### Phase 4: Implementation
1. Fix the root cause, not the symptom
2. Verify the fix works
3. Check if the same bug might exist elsewhere
