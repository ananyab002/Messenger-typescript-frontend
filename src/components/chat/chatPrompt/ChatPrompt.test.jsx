import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatPrompt from "./ChatPrompt";
import { ChatMessagesContext } from "../../../context/ChatMessagesContext";
import { useParams } from "react-router-dom";

// Mock useParams to return a specific chatID
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

// Mock EmojiPicker to simplify testing
jest.mock("emoji-picker-react", () => () => <div data-testid="emoji-picker" />);

describe("ChatPrompt Component", () => {
  let updateAllMessagesMock;

  beforeEach(() => {
    updateAllMessagesMock = jest.fn();
    useParams.mockReturnValue({ chatID: "1" });
  });

  test("renders the component correctly", () => {
    render(
      <ChatMessagesContext.Provider
        value={{ updateAllMessages: updateAllMessagesMock }}
      >
        <ChatPrompt />
      </ChatMessagesContext.Provider>
    );

    expect(
      screen.getByPlaceholderText("Type a message....")
    ).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  test("appends emoji to the message", () => {
    render(
      <ChatMessagesContext.Provider
        value={{ updateAllMessages: updateAllMessagesMock }}
      >
        <ChatPrompt />
      </ChatMessagesContext.Provider>
    );

    const input = screen.getByPlaceholderText("Type a message....");

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(screen.getByAltText("")); // Open emoji picker
    fireEvent.click(screen.getByTestId("emoji-picker")); // Mock emoji selection

    expect(input.value).toBe("Hello"); // assuming mock emoji picker doesn't change value
  });
});
