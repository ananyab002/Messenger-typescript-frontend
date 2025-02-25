
import "./registerpage.scss";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";

import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

interface RegisterFormData {
  email: string,
  password: string,
  confirmPassword: string,
  name: string,
  dob: Date,
  gender: string,
  country: string
}

interface CountryData {
  [id: string]: string
}
const RegisterPage = () => {

  const [countries, setCountries] = useState<CountryData>({});

  const getCountryData = async () => {
    const request = await fetch("/data/country.json");
    const countriesdata = await request.json();
    console.log(countriesdata);
    setCountries(countriesdata);
    console.log(countries);
  }

  useEffect(() => { getCountryData() }, [])

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    // const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    // await delay(1000);
    const response = await fetch("http://127.0.0.1:8000/users/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const resData = await response.json();
    console.log(resData.message)
  }

  return (
    <div className="register">
      {" "}
      <h3>Register</h3>
      <div className="register-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="items">
            <input {...register("email",
              {
                required: "Email is required",
                pattern: { value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, message: "Email is incorrect format" }
              }
            )} placeholder="Enter your email" />
            {errors.email && <div>{errors.email.message}</div>}
            <input {...register("password",
              {
                required: "Password is required",
                minLength: { value: 4, message: "Minimum length should be 4" }
              })} placeholder="Enter your password" />
            {errors.password && <div>{errors.password.message}</div>}

            <input {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) => {
                if (value !== getValues("password"))
                  return "Passwords dont match"
                return true
              }
            })} placeholder="Confirm your password" />
            {errors.confirmPassword && <div>{errors.confirmPassword.message} </div>}
            <input {...register("name", {
              required: "Name is required"
            })} placeholder="Enter your name" />
            {errors.name && <div>{errors.name.message}</div>}

            <Controller
              rules={{ required: "Date is required" }}
              name="dob"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <DatePicker selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  placeholderText="Date of birth"
                  className="dob"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                />)}

            >
            </Controller>
            {errors.dob && <div>{errors.dob.message} </div>}
            <div className="gender">
              <div className="genderItems">
                <input {...register("gender", {
                  required: "Gender is required"
                })} value="male" type="radio" />Male
              </div>
              <div className="genderItems">
                <input {...register("gender", {
                  required: "Gender is required"
                })} value="female" type="radio" />Female
              </div>
            </div>
            {errors.gender && <div>{errors.gender.message} </div>}
            <select className="country" {...register("country", {
              required: "Country is required"
            })}>
              <option>select</option>
              {Object.entries(countries).map(
                ([id, name]) =>
                (<option key={id} value={name}>
                  {name}
                </option>))}

            </select>
            {errors.country && <div>{errors.country.message} </div>}
            <div className="rb">
              <button className="registerButton" >{isSubmitting ? "Submitting...." : "Register"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
