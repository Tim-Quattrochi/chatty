import { describe, it, expect, vi } from "vitest";
import { addChat, loadChats, handleChange } from "./chatService";

describe("addChat", () => {
  it("should be a function", () => {
    expect(typeof addChat).toBe("function");
  });

  it("should call socket.emit", () => {
    const socket = {
      emit: vi.fn(),
      on: vi.fn(),
    };
    const spy = vi.spyOn(socket, "emit");
    addChat(
      "roomName",
      "chatDispatch",
      "otherUid",
      "userId",
      socket,
      "navigate"
    );

    expect(spy).toHaveBeenCalled();
  });

  it("should call socket.on", () => {
    const socket = {
      emit: vi.fn(),
      on: vi.fn(),
    };
    const spy = vi.spyOn(socket, "on");
    addChat(
      "roomName",
      "chatDispatch",
      "otherUid",
      "userId",
      socket,
      "navigate",
      "roomJoined",
      "room"
    );

    expect(spy).toHaveBeenCalled();
  });
  it("should load chats and dispatch them to state", () => {
    // Mock chats array
    const mockedChats = [
      { id: 1, message: "what's up?" },
      { id: 2, message: "yo" },
    ];

    // Mock chatDispatch function
    const chatDispatch = vi.fn();

    // Call loadChats function
    loadChats(mockedChats, chatDispatch);

    expect(chatDispatch).toHaveBeenCalledWith({
      type: "LOAD_CHATS",
      payload: [
        { id: 1, message: "what's up?" },
        { id: 2, message: "yo" },
      ],
    });
  });

  // Tests that handleChange function calls handleDispatch with the correct parameters
  it("should call handleDispatch with the correct parameters", () => {
    const dispatch = vi.fn();
    const e = {
      target: {
        name: "testName",
        value: "testValue",
      },
    };
    handleChange(e, dispatch);

    //assertion
    expect(dispatch).toHaveBeenCalledWith({
      type: "HANDLE_CHANGE",
      payload: {
        name: "testName",
        value: "testValue",
      },
    });
  });
});
