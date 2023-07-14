import { render, screen, waitFor } from "../../test-utils";;
import Studentview from './index';

describe("Studentview", () => {
  beforeAll(() => {
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener: function () {},
          removeListener: function () {},
        };
      };
  });
  beforeEach(() => {
    render(<Studentview />);
  });

  test("renders 'Certificates you have achieved' text if data array has length > 0", () => {
    const testData = [{ id: 1, name: "Certificate 1" }, { id: 2, name: "Certificate 2" }];
    jest.spyOn(window.localStorage.__proto__, "getItem").mockReturnValueOnce(JSON.stringify({ token: "testToken" }));
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(testData),
    });
    render(<Studentview />);

    expect(screen.getByText("Certificates you have achieved")).toBeInTheDocument();
    expect(screen.queryByText("We do not have any certificate associated with your email address.")).not.toBeInTheDocument();
  });

  test("renders 'We do not have any certificate associated with your email address.' text if data array is empty", () => {
    const testData = [];
    jest.spyOn(window.localStorage.__proto__, "getItem").mockReturnValueOnce(JSON.stringify({ token: "testToken" }));
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(testData),
    });
    render(<Studentview />);

    expect(screen.getByText("We do not have any certificate associated with your email address.")).toBeInTheDocument();
    expect(screen.queryByText("Certificates you have achieved")).not.toBeInTheDocument();
  });

  test("renders certificate cards if data array has length > 0", async () => {
    const testData = [{ id: 1, name: "Certificate 1" }, { id: 2, name: "Certificate 2" }];
    jest.spyOn(window.localStorage.__proto__, "getItem").mockReturnValueOnce(JSON.stringify({ token: "testToken" }));
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(testData),
    });
    render(<Studentview />);

    const certificateCards = await screen.findAllByRole("img");
    expect(certificateCards.length).toBe(2);
  });
});