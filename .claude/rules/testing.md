---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "e2e/**/*.ts"
---

# Test assertion conventions

Examples use Vitest's `expect` API, React Testing Library, and the jest-dom
matchers (imported from `@testing-library/jest-dom/vitest`). The goal of every
rule below: a test should
fail for exactly one reason, and its failure message should tell you what broke
without opening the test.

## Structure every test as Arrange — Act — Assert

```ts
// Muddled — setup, action, and checks are interleaved and hard to scan
const user = makeUser({ role: 'admin' });
expect(canEditSettings(user)).toBe(true);
const guest = makeUser({ role: 'guest' });
expect(canEditSettings(guest)).toBe(false);

// Three phases, separated by a blank line: build inputs, run the behavior once,
// then assert the outcome
const user = makeUser({ role: 'admin' });

const allowed = canEditSettings(user);

expect(allowed).toBe(true);
```

*Why: the Arrange–Act–Assert shape makes each test's intent obvious at a glance
and keeps a test focused on a single action. Split the "act" of a second,
unrelated action into its own `it` block rather than stacking act/assert pairs.*

## Query and assert by accessible role or text, not by test ID or DOM structure

```tsx
// Brittle — couples the test to markup and CSS class names
expect(container.querySelector('.submit-btn')).toBeTruthy();

// Resilient + readable — matches how a user actually finds the control
expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
```

*Why: role/label queries survive refactors of the DOM and styling, and they
double as an accessibility check. Reach for `getByTestId` only when no
accessible query fits.*

## Use jest-dom matchers, not manual truthiness

```tsx
// Poor failure output: "expected false to be true"
expect(screen.queryByText('Saved') !== null).toBe(true);

// Clear failure output that states intent
expect(screen.getByText('Saved')).toBeInTheDocument();
```

*Why: `toBeInTheDocument`, `toBeDisabled`, `toHaveTextContent`, etc. produce
diagnostic failures; hand-rolled boolean checks collapse to "false is not true".*

## Assert the subset you care about with `toMatchObject`

```ts
// Brittle — re-breaks whenever an unrelated field is added to the object
expect(user).toEqual({ id: 1, name: 'Ada', role: 'admin', createdAt: '...' });

// Asserts only the behavior under test
expect(user).toMatchObject({ role: 'admin' });
```

*Why: full-object equality fails for reasons unrelated to what the test checks.*

## Never assert on generated IDs, timestamps, or ordering you don't control

```ts
// Brittle — id and createdAt are non-deterministic
expect(created).toEqual({ id: 'a1b2', createdAt: '2026-01-03T10:00Z', title: 'Draft' });

// Assert the meaningful value; assert incidental fields by shape, not value
expect(created.title).toBe('Draft');
expect(created.id).toEqual(expect.any(String));
```

*Why: nanoid/uuid values, `Date.now()`, and unsorted query results change
between runs and break tests that pin them.*

## Assert observable outcomes, not that a mock was called

```tsx
// Brittle — passes even if nothing the user can see actually happened
expect(saveMock).toHaveBeenCalled();

// Better — asserts the outcome a user would observe
expect(await screen.findByText('Changes saved')).toBeInTheDocument();
```

*Why: mock-verification couples the test to how the code works, so it re-breaks
on every refactor. Exception: when the call itself is the contract — an
analytics event, an outbound email — assert on it directly, e.g.
`expect(analytics.track).toHaveBeenCalledWith('checkout_completed', { total: 42 })`.*

## Await `findBy*` for async UI; never query immediately after an async action

```tsx
// Flaky — queries before the async update lands
fireEvent.click(screen.getByRole('button', { name: /load/i }));
expect(screen.getByText('Ada')).toBeInTheDocument();

// Correct — userEvent + findBy waits for the element to appear
await userEvent.click(screen.getByRole('button', { name: /load/i }));
expect(await screen.findByText('Ada')).toBeInTheDocument();
```

*Why: `findBy*` retries until the DOM settles; synchronous `getBy*` after an
async action races the render and flakes in CI.*

## Type fixtures with factories; no `as any`, no scattered magic literals

```ts
// Magic values with no provenance, and `as any` disables the type check
const user = { id: 1, name: 'Ada', role: 'admin' } as any;

// Named, typed factory — intent is explicit, reused, and type-checked
const user = makeUser({ role: 'admin' });
```

*Why: the expected value should be self-documenting, and `as any` in tests hides
the same type errors the tests exist to catch.*

## Route handlers and API tests: assert status plus the fields the endpoint promises

```ts
// Assert the status code and only the body fields that are part of the contract
expect(res.status).toBe(201);
const body = await res.json();
expect(body).toMatchObject({ role: 'admin' });
```

*Why: comparing the whole `Response` or full body pins serialization details the
endpoint never promised.*

## When full-object equality or snapshots ARE the right call

Do not strip assertions down to one field when the whole shape is the contract:
a serializer's output, an API response schema, or a reducer's next state. In
those cases assert the complete object with `toEqual`. Use inline snapshots
(`toMatchInlineSnapshot`) sparingly and only for small, stable, human-reviewable
values — avoid large auto-generated component snapshots, which nobody reads and
which "update" past every real regression.
