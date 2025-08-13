// Mapping technical field names to user-friendly labels
const fieldLabelMap = {
  "ctl00$ContentPlaceHolder1$txtadharno": "Aadhaar Number",
  "ctl00$ContentPlaceHolder1$txtownername": "Owner Name",
  "ctl00$ContentPlaceHolder1$txtPan": "PAN Number",
  "ctl00$ContentPlaceHolder1$txtPanName": "Name as per PAN",
  "ctl00$ContentPlaceHolder1$txtdob": "Date of Birth",
  "ctl00$ContentPlaceHolder1$ddlTypeofOrg": "Type of Organisation",
  "ctl00$ContentPlaceHolder1$rbpanyesno": "Do you have PAN?",
  "ctl00$ContentPlaceHolder1$rbdDOB": "DOB Type",
  "ctl00$ContentPlaceHolder1$chkDecarationP": "PAN Declaration",
  "ctl00$ContentPlaceHolder1$pin": "PIN Code",
  "ctl00$ContentPlaceHolder1$city": "City",
  "ctl00$ContentPlaceHolder1$state": "State",
  // Add more mappings as needed
};

export default function Home({ formSchema, formData, handleChange, handleSubmit, errors, fieldLabelMap, otpSent, otpValue, setOtpValue }) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white/90 shadow-2xl p-8 rounded-2xl border border-blue-100 backdrop-blur-md"
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-700 tracking-tight drop-shadow-sm">
          Udyam Registration
        </h2>
        <p className="text-center text-gray-500 mb-8 text-lg">Step 1 &amp; 2</p>

        <div className="grid gap-6 md:grid-cols-2">
          {formSchema.filter(field => field.type !== "hidden" && field.type !== "submit" && field.name !== "ctl00$ContentPlaceHolder1$chkDecarationP").map((field, idx) => (
            <div key={idx} className="flex flex-col gap-1 bg-blue-50/60 rounded-lg p-4 shadow-sm border border-blue-100">
              <label className="font-semibold text-blue-800 mb-1 text-sm tracking-wide">
                {fieldLabelMap[field.name] || field.label || field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 transition"
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                disabled={otpSent && field.name === "ctl00$ContentPlaceHolder1$txtadharno"}
              />
              {errors && errors[field.name] && (
                <span className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* PAN Declaration checkbox highlighted above submit button */}
        {formSchema.some(field => field.name === "ctl00$ContentPlaceHolder1$chkDecarationP") && (
          <div className="flex items-center justify-center my-6">
            <label className="flex items-center bg-yellow-100 border-2 border-yellow-400 rounded-lg px-4 py-3 shadow font-semibold text-yellow-800 text-base">
              <input
                type="checkbox"
                name="ctl00$ContentPlaceHolder1$chkDecarationP"
                className="mr-3 w-5 h-5 accent-yellow-500"
                checked={!!formData["ctl00$ContentPlaceHolder1$chkDecarationP"]}
                onChange={e => handleChange("ctl00$ContentPlaceHolder1$chkDecarationP", e.target.checked)}
                required={formSchema.find(f => f.name === "ctl00$ContentPlaceHolder1$chkDecarationP")?.required}
              />
              {fieldLabelMap["ctl00$ContentPlaceHolder1$chkDecarationP"] || "PAN Declaration"}
              {errors && errors["ctl00$ContentPlaceHolder1$chkDecarationP"] && (
                <span className="text-red-500 text-xs ml-2">{errors["ctl00$ContentPlaceHolder1$chkDecarationP"]}</span>
              )}
            </label>
          </div>
        )}

        {/* OTP input for Step 2 */}
        {otpSent && typeof otpValue !== 'undefined' && typeof setOtpValue === 'function' && (
          <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="border border-blue-200 rounded-lg px-3 py-2"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              required
            />
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Submit OTP</button>
            {errors && errors.otp && <span className="text-red-500 text-xs mt-1">{errors.otp}</span>}
          </div>
        )}

        {!otpSent && (
          <button
            type="submit"
            className="mt-10 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 text-lg tracking-wide uppercase"
          >
            Submit
          </button>
        )}
      </form>
    </section>

  );
}