import { fireEvent, render, screen } from "../../test-utils";
import Signup from "./index";

describe("Signup", () => {
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
    render(<Signup />);
  });

  test("Renders correctly", () => {
    render(<Signup />);
  });

  test("signup left side image", () => {
    const signupImage = screen.getByRole("img", { name: /signupimage/i });
    expect(signupImage).toBeInTheDocument();
  });

  test("MasaiLogo", () => {
    const masaiLogo = screen.getByRole("img", { name: /logo/i });
    expect(masaiLogo).toBeInTheDocument();
  });
  test("signup button ?", () => {
    const signupbutton = screen.getByRole("button", {
      name: /Sign Up/i})
      expect(signupbutton).toBeInTheDocument();
    });

  test("is login routing working?", () => {
    const loginRouting = screen.getByRole("button", {
      name: /i already have an account/i,
    });
    fireEvent.click(loginRouting);
    expect(window.location.pathname).toBe("/login");
  });
});