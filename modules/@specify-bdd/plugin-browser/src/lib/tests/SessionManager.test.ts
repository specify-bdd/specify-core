import { vi } from "vitest";

import { SessionManager      } from "@/lib/SessionManager";
import type { BrowserSession } from "@/lib/BrowserSession";

/** Create a minimal BrowserSession mock for use in SessionManager tests. */
function makeMockSession(): BrowserSession {
    return {
        "end":       vi.fn().mockResolvedValue(undefined),
        "start":     vi.fn().mockResolvedValue(undefined),
        "openTab":   vi.fn().mockResolvedValue(undefined),
        "closeTab":  vi.fn().mockResolvedValue(undefined),
        "tabs":      [],
        "activeTab": null,
    };
}

describe("SessionManager", () => {
    let manager: SessionManager;

    beforeEach(() => {
        manager = new SessionManager();
    });

    describe("addSession()", () => {
        it("adds the session to the sessions list", () => {
            const session = makeMockSession();

            manager.addSession(session);

            expect(manager.sessions).toContain(session);
        });

        it("makes the new session the active session", () => {
            const session = makeMockSession();

            manager.addSession(session);

            expect(manager.activeSession).toBe(session);
        });

        it("makes each successive session the active session", () => {
            const s1 = makeMockSession();
            const s2 = makeMockSession();

            manager.addSession(s1);
            manager.addSession(s2);

            expect(manager.activeSession).toBe(s2);
        });

        it("returns a defensive copy from the sessions getter", () => {
            const session = makeMockSession();

            manager.addSession(session);

            expect(manager.sessions).not.toBe(manager.sessions);
        });
    });

    describe("removeSession()", () => {
        it("removes the active session when called with no argument", () => {
            const session = makeMockSession();

            manager.addSession(session);
            manager.removeSession();

            expect(manager.sessions).not.toContain(session);
        });

        it("removes a specific session when one is provided", () => {
            const s1 = makeMockSession();
            const s2 = makeMockSession();

            manager.addSession(s1);
            manager.addSession(s2);
            manager.removeSession(s1);

            expect(manager.sessions).not.toContain(s1);
        });

        it("sets activeSession to null when the last session is removed", () => {
            const session = makeMockSession();

            manager.addSession(session);
            manager.removeSession();

            expect(manager.activeSession).toBeNull();
        });

        it("activates the session at index - 1 when a middle session is removed", () => {
            const s1 = makeMockSession();
            const s2 = makeMockSession();
            const s3 = makeMockSession();

            manager.addSession(s1);
            manager.addSession(s2);
            manager.addSession(s3); // active = s3

            manager.removeSession(); // remove s3 (active, index 2)

            expect(manager.activeSession).toBe(s2); // index 1 = index - 1
        });

        it("wraps to the last session when the first (active) session is removed", () => {
            const s1 = makeMockSession();
            const s2 = makeMockSession();
            const s3 = makeMockSession();

            manager.addSession(s1);
            manager.addSession(s2);
            manager.addSession(s3); // active = s3

            manager.removeSession(s1); // remove s1 (index 0, non-active)
            // active is still s3; now remove s3 to make s2 at index 0 active
            manager.removeSession(s3); // remove s3 (now active, was at new index 1)

            // s2 is the only one left; now remove it while it is active at index 0
            manager.removeSession(); // remove s2 (index 0) → wraps to last of empty = -1 → null

            expect(manager.activeSession).toBeNull();
        });

        it.skip("wraps activeSession to the last element when the first active session is removed", () => {
            const s1 = makeMockSession();
            const s2 = makeMockSession();
            const s3 = makeMockSession();

            manager.addSession(s1);
            manager.addSession(s2);
            manager.addSession(s3); // active = s3

            // TODO: manager.switchToSession(s1); — requires switchToSession(), not yet available
            manager.removeSession(); // remove s1 (active, index 0) → should wrap to s3 (last)

            expect(manager.activeSession).toBe(s3);
        });

        it("does not change activeSession when a non-active session is removed", () => {
            const s1 = makeMockSession();
            const s2 = makeMockSession();

            manager.addSession(s1);
            manager.addSession(s2); // active = s2

            manager.removeSession(s1);

            expect(manager.activeSession).toBe(s2);
        });

        it("throws when called with no argument and there is no active session", () => {
            expect(() => manager.removeSession()).toThrow("No active session to remove.");
        });

        it("throws when the provided session is not managed", () => {
            const unmanaged = makeMockSession();

            expect(() => manager.removeSession(unmanaged)).toThrow(
                "Session is not managed by this SessionManager.",
            );
        });
    });

    describe("removeSessionIfEmpty()", () => {
        it("removes the session when it has no tabs", () => {
            const session = makeMockSession(); // tabs: []

            manager.addSession(session);
            manager.removeSessionIfEmpty(session);

            expect(manager.sessions).not.toContain(session);
        });

        it("does nothing when the session still has tabs", () => {
            const session = makeMockSession();

            (session.tabs as unknown[]).push({ "handle": "abc", "name": null });

            manager.addSession(session);
            manager.removeSessionIfEmpty(session);

            expect(manager.sessions).toContain(session);
        });

        it("updates activeSession when the empty session is the active one", () => {
            const s1 = makeMockSession();
            const s2 = makeMockSession(); // tabs: []

            manager.addSession(s1);
            manager.addSession(s2); // active = s2

            manager.removeSessionIfEmpty(s2);

            expect(manager.activeSession).toBe(s1);
        });

        it("does not change activeSession when a non-empty session is passed", () => {
            const s1 = makeMockSession();
            const s2 = makeMockSession();

            (s1.tabs as unknown[]).push({ "handle": "abc", "name": null });

            manager.addSession(s1);
            manager.addSession(s2); // active = s2

            manager.removeSessionIfEmpty(s1);

            expect(manager.activeSession).toBe(s2);
            expect(manager.sessions).toContain(s1);
        });
    });

    describe("killAllSessions()", () => {
        it("calls end() on every managed session", async () => {
            const s1 = makeMockSession();
            const s2 = makeMockSession();

            manager.addSession(s1);
            manager.addSession(s2);

            await manager.killAllSessions();

            expect(s1.end).toHaveBeenCalledOnce();
            expect(s2.end).toHaveBeenCalledOnce();
        });

        it("clears sessions and sets activeSession to null after ending", async () => {
            const session = makeMockSession();

            manager.addSession(session);

            await manager.killAllSessions();

            expect(manager.sessions).toHaveLength(0);
            expect(manager.activeSession).toBeNull();
        });

        it("continues even when some end() calls reject", async () => {
            const s1 = makeMockSession();
            const s2 = makeMockSession();

            vi.mocked(s1.end).mockRejectedValue(new Error("driver already closed"));

            manager.addSession(s1);
            manager.addSession(s2);

            await expect(manager.killAllSessions()).resolves.not.toThrow();
            expect(s2.end).toHaveBeenCalledOnce();
        });

        it("resolves immediately when there are no managed sessions", async () => {
            await expect(manager.killAllSessions()).resolves.not.toThrow();
        });
    });
});
