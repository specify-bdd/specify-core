import { vi             } from "vitest";
import { SessionManager } from "./SessionManager";
import { ShellSession   } from "./ShellSession";

import type { ShellSession as MockShellSession } from "./__mocks__/ShellSession";

vi.mock("./ShellSession");

describe("SessionManager", () => {
    let session: MockShellSession;
    let sessionManager: SessionManager;

    beforeEach(() => {
        session = new ShellSession() as unknown as MockShellSession;
        sessionManager = new SessionManager();

        sessionManager.addSession(session);
    });

    // describe("activeSession", () => {
    //     // TODO: are there any tests we can put here that are distinct from addSession's?
    // });

    describe("exitCode", () => {
        it("reports the last command's exit code", async () => {
            const promise = sessionManager.run("echo test");

            session.emitDelimiter(0);

            await promise;

            expect(sessionManager.exitCode).toBe(0);
        });
    });

    describe("output", () => {
        it("reports the last command's output", async () => {
            const output  = "test";
            const command = `echo ${output}`;
            const promise = sessionManager.run(command);

            session.emitOutput(output);
            session.emitDelimiter(0);

            await promise;

            expect(sessionManager.output).toBe(output);
        });

        it("reports multiple lines of command output", async () => {
            const output  = ["test 1", "test 2"];
            const promise = sessionManager.run("some-command");

            session.emitOutput(output[0]);
            session.emitOutput(output[1]);
            session.emitDelimiter(0);

            await promise;

            expect(sessionManager.output).toBe(output.join("\n"));
        });

        it("ignores delimiter-only output", async () => {
            const promise = sessionManager.run("cd .");

            session.emitDelimiter(0);

            await promise;

            expect(sessionManager.output).toBe("");
        });
    });

    // describe("sessions", () => {
    //     // TODO: are there any tests we can put here that are distinct from addSession's?
    // });

    describe("addSession()", () => {
        it("registers a single managed session", async () => {
            expect(sessionManager.sessions.length).toBe(1);
            expect(sessionManager.sessions[0].session).toBe(session);
        });

        it("registers multiple managed sessions", async () => {
            const altSession = new ShellSession() as unknown as MockShellSession;

            sessionManager.addSession(altSession);

            expect(sessionManager.sessions.length).toBe(2);
            expect(sessionManager.sessions[1].session).toBe(altSession);
        });

        it("registers named managed sessions", async () => {
            const altSession     = new ShellSession() as unknown as MockShellSession;
            const altSessionName = "test session";

            sessionManager.addSession(altSession, altSessionName);

            expect(sessionManager.sessions[1].name).toBe(altSessionName);
        });

        it("activates new managed sessions by default", async () => {
            expect(sessionManager.activeSession.session).toBe(session);
        });

        it("doesn't activate new managed sessions if instructed not to", async () => {
            const altSession = new ShellSession() as unknown as MockShellSession;

            sessionManager.addSession(altSession, "whatever", false);

            expect(sessionManager.activeSession.session).toBe(session);
        });
    });

    describe("kill()", () => {
        it("resolves kill() on session close", async () => {
            let resolved = false;

            const promise = sessionManager.kill().then(() => (resolved = true));

            // wait arbitrary time to ensure promise hasn't resolved
            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(resolved).toBeFalsy();

            session.emitClose();

            await promise;

            expect(session.kill).toHaveBeenCalled();
            expect(resolved).toBeTruthy();
        });
    });

    describe("killAll()", () => {
        it("kills all managed sessions", async () => {
            const altSession = new ShellSession() as unknown as MockShellSession;

            let resolved = false;

            sessionManager.addSession(altSession);

            expect(sessionManager.sessions.length).toBe(2);

            const promise = sessionManager.killAll().then(() => (resolved = true));

            // wait arbitrary time to ensure promise hasn't resolved
            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(resolved).toBeFalsy();

            session.emitClose();
            altSession.emitClose();

            await promise;

            expect(sessionManager.sessions.length).toBe(0);
        });
    });

    describe("removeSession()", () => {
        it("removes the sole managed session", async () => {
            expect(sessionManager.sessions.length).toBe(1);

            sessionManager.removeSession();

            expect(sessionManager.sessions.length).toBe(0);
            expect(sessionManager.activeSession).toBeNull();
        });

        it("removes one managed session among several", async () => {
            const altSession = new ShellSession() as unknown as MockShellSession;

            sessionManager.addSession(altSession, "whatever", false);

            expect(sessionManager.sessions.length).toBe(2);
            expect(sessionManager.activeSession.session).toBe(session);

            sessionManager.removeSession(altSession);

            expect(sessionManager.sessions.length).toBe(1);
            expect(sessionManager.activeSession.session).toBe(session);
        });

        it("removes the active session among several", async () => {
            const altSession = new ShellSession() as unknown as MockShellSession;

            sessionManager.addSession(altSession);

            expect(sessionManager.sessions.length).toBe(2);
            expect(sessionManager.activeSession.session).toBe(altSession);

            sessionManager.removeSession();

            expect(sessionManager.sessions.length).toBe(1);
            expect(sessionManager.activeSession.session).toBe(session);
        });
    });

    describe("run()", () => {
        it("writes command to session and resolves after delimiter", async () => {
            const output  = "test";
            const command = `echo ${output}`;
            const promise = sessionManager.run(command);

            session.emitOutput(output);
            session.emitDelimiter(0);

            await promise;

            expect(session.write).toHaveBeenCalledWith(expect.stringContaining(command));
        });

        it("resolves when delimiter output is received", async () => {
            let resolved = false;

            const promise = sessionManager.run("echo test").then(() => (resolved = true));

            session.emitOutput("test");

            // wait arbitrary time to ensure promise hasn't resolved
            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(resolved).toBeFalsy();

            session.emitDelimiter(0);

            await promise;

            expect(resolved).toBeTruthy();
        });

        it("throws if output contains malformed delimiter", async () => {
            // this promise will never resolve because malformed delimiter doesn't trigger resolution
            void sessionManager.run("echo bad");

            expect(() => {
                session.emitDelimiter(0, true);
            }).toThrow(/^Output does not contain a value for ".+"$/);
        });

        it("throws if called while another command is in progress", async () => {
            const command = 'echo "long-running command"';

            // this promise will never resolve due to the throw
            void sessionManager.run(command);

            await expect(sessionManager.run('echo "overlapping command"')).rejects.toThrow(
                `A command is already running: ${command}`,
            );
        });
    });
});
