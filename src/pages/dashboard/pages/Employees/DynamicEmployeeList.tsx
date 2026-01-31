

const DynamicEmployeeList = () => {
  return (
    <div className="space-y-4 p-4">
      {/* Risk Type */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <label className="w-full md:w-1/4 text-sm font-medium">
          Risk Type <i className="fas fa-info-circle text-gray-400"></i>
        </label>
        <select
          className="w-full md:w-3/4 p-2 border border-gray-300 rounded-lg"
          id="empRiskTypeSelect2"
        >
          <option value="humanRisk">Human Risk</option>
          <option value="phishRisk">Phish Risk</option>
        </select>
      </div>

      {/* Risk Scores */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <label className="w-full md:w-1/4 text-sm font-medium">
          Risk Scores <i className="fas fa-info-circle text-gray-400"></i>
        </label>
        <select
          className="w-full md:w-3/4 p-2 border border-gray-300 rounded-lg"
          id="empRiskSelect2"
          multiple
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Employee Lists */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <label className="w-full md:w-1/4 text-sm font-medium">
          Employee Lists <i className="fas fa-info-circle text-gray-400"></i>
        </label>
        <select
          className="w-full md:w-3/4 p-2 border border-gray-300 rounded-lg"
          id="tListSelect2"
          multiple
        >
          <option value="Account-Owner">Account-Owner</option>
        </select>
      </div>

      {/* Video Card */}
      <div className="hidden lg:block mt-4">
        <a
          href="https://www.youtube.com/watch?v=jP6OtBCA4yg"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-4 bg-white rounded-lg shadow-md"
        >
          <div className="relative">
            <img
              src="https://d3p8e1mvy30w84.cloudfront.net/assets/images/thumbnails/risk-based-phishing-thumbnail.png"
              alt="Video Thumbnail"
              className="w-24 h-24 rounded-lg"
            />
            <i className="fas fa-play-circle absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl"></i>
          </div>
          <div className="ml-4">
            <small className="text-xs font-bold uppercase text-gray-600">
              WALKTHROUGH VIDEO
            </small>
            <p className="text-lg font-semibold text-gray-800">
              Learn about risk-based phishing campaigns.
            </p>
          </div>
        </a>
      </div>

      {/* Sync Button */}
      <div className="mt-4">
        <button
          type="button"
          className="p-2 bg-purple-950 text-white hover:bg-purple-800 rounded-lg"
        >
          <i className="fas fa-sync"></i> Sync Dynamic Employee List
        </button>
      </div>
    </div>
  );
};

export default DynamicEmployeeList;