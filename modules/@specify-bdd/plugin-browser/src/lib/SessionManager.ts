/**
 * Browser Session Manager Module
 *
 * Tracks the set of open browser sessions and the currently active one.
 * Mirrors the session-lifecycle API of the CLI plugin's SessionManager.
 */

import assert, { AssertionError } from "node:assert/strict";

import type { BrowserSession } from "@/lib/BrowserSession";

/**
 * Manages the lifecycle of browser sessions within a scenario.
 *
 * Maintains an ordered list of open sessions and a pointer to the active one.
 * The active session is updated automatically when sessions are added or removed.
 */
export class SessionManager {
    /** The currently active session, or `null` if none are open. */
    #activeSession: BrowserSession | null = null;

    /** All sessions currently being managed. */
    #sessions: BrowserSession[] = [];

    /**
     * The currently active session, or `null` if none are open.
     */
    get activeSession(): BrowserSession | null {
        return this.#activeSession;
    }

    /**
     * A snapshot of all currently managed sessions.
     */
    get sessions(): BrowserSession[] {
        return this.#sessions.slice();
    }

    /**
     * Add a session and make it the active session.
     *
     * The caller is responsible for calling `session.start()` before adding it.
     *
     * @param session - The session to track
     */
    addSession(session: BrowserSession): void {
        this.#sessions.push(session);
        this.#activeSession = session;
    }

    /**
     * Remove a session and update the active session pointer.
     *
     * When no `session` is provided the active session is removed. After
     * removal, `activeSession` is set to the session at `index - 1`, wrapping
     * to the last session if the removed session was at index 0, or `null` if
     * no sessions remain.
     *
     * @param session - The session to remove; defaults to the active session
     *
     * @throws AssertionError If no argument is given and there is no active session.
     * @throws AssertionError If the given session is not managed by this instance.
     */
    removeSession(session?: BrowserSession): void {
        const target = session ?? this.#activeSession;

        assert.ok(target, new AssertionError({ "message": "No active session to remove." }));

        const index = this.#sessions.indexOf(target);

        assert.ok(
            index !== -1,
            new AssertionError({ "message": "Session is not managed by this SessionManager." }),
        );

        this.#sessions.splice(index, 1);

        if (this.#activeSession === target) {
            const prevIndex = index === 0 ? this.#sessions.length - 1 : index - 1;

            this.#activeSession = prevIndex < 0 ? null : (this.#sessions[prevIndex] ?? null);
        }
    }

    /**
     * Remove a session if it has no remaining tabs.
     *
     * A no-op when the session still has open tabs. When the session has no tabs
     * remaining it is removed exactly as `removeSession(session)` would remove it.
     *
     * @param session - The session to conditionally remove
     */
    removeSessionIfEmpty(session: BrowserSession): void {
        if (session.tabs.length === 0) {
            this.removeSession(session);
        }
    }

    /**
     * End all managed sessions (best-effort) and clear all session state.
     *
     * Uses `Promise.allSettled` so that a failed `.end()` call does not prevent
     * the remaining sessions from being cleaned up.
     */
    async killAllSessions(): Promise<void> {
        await Promise.allSettled(this.#sessions.map((s) => s.end()));

        this.#sessions = [];
        this.#activeSession = null;
    }
}
