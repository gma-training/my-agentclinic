<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Network access

When something can't be fetched from the network (blocked host, failed download, unreachable registry), **stop and ask how to proceed** — do not work around it (switching approaches, vendoring, swapping dependencies, etc.) on your own initiative.

The firewall is deliberate good practice, **not** a policy to avoid the network. Specific offline choices already in the repo (e.g. vendoring the Geist font locally) are individual decisions, not a general directive — do not treat them as precedent for routing around network restrictions.
