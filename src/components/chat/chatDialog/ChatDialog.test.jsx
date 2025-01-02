import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ChatMessagesContext } from "../../../context/ChatMessagesContext";
import ChatDialog from "./ChatDialog";
import { getDate } from "../../../utils/date";

// Mock the getDate function
jest.mock("../../../utils/date", () => ({
  getDate: (date) => date,
}));

describe("ChatDialog Component", () => {
  const mockMessages = {
    1: [
      {
        id: 1,
        message: "Hello",
        date: getDate(new Date().toDateString()),
        time: "10:00 AM",
      },
      {
        id: 2,
        message: "Hi there!",
        date: getDate(new Date().toDateString()),
        time: "10:05 AM",
      },
    ],
  };

  const renderComponent = (chatID) => {
    render(
      <ChatMessagesContext.Provider value={{ allMessages: mockMessages }}>
        <MemoryRouter initialEntries={[`/${chatID}`]}>
          <Routes>
            <Route path="/:chatID" element={<ChatDialog />} />
          </Routes>
        </MemoryRouter>
      </ChatMessagesContext.Provider>
    );
  };

  test("renders messages correctly", () => {
    renderComponent("1");

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
    expect(
      screen.getAllByText(getDate(new Date().toDateString()))
    ).toHaveLength(2);
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    expect(screen.getByText("10:05 AM")).toBeInTheDocument();
  });

  test("does not render messages if chatID does not exist", () => {
    renderComponent("2");

    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
    expect(screen.queryByText("Hi there!")).not.toBeInTheDocument();
  });
});
