import { College } from "@/Types";

export default function CollegeCard({ college }: { college: College }) {
  return (
    <div className="card bg-base-300/90 w-96 shadow-lg transition-transform duration-200 hover:scale-105">
      <figure>
        <img
          src={college.profileImage || "/college-placeholder.png"}
          alt={college.name}
          className="rounded-t-lg w-full h-48 object-contain"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl font-semibold">{college.name}</h2>

        {/* College Details */}
        <div className="space-y-2">
          <p className="text-sm text-base-content/60">
            <strong>Email: </strong>
            <a href={`mailto:${college.email}`} className="link link-primary">
              {college.email}
            </a>
          </p>
          <p className="text-sm text-base-content/60">
            <strong>Phone: </strong>
            {college.phone || "Not Provided"}
          </p>
          <p className="text-sm text-base-content/60">
            <strong>Website: </strong>
            <a
              href={college.website}
              className="link link-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {college.website || "Not Available"}
            </a>
          </p>
          <div className="text-sm text-base-content/60">
            <strong>Address: </strong>
            {college.address ? (
              <>
                {college.address.street}, {college.address.taluka},{" "}
                {college.address.district}, {college.address.state},{" "}
                {college.address.pincode}
              </>
            ) : (
              "Not Available"
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-base-content/60">
              <strong>Total Events: </strong>
              {college.stats?.totalEvents || 0}
            </span>
            <span className="text-sm text-base-content/60">
              <strong>Total Students: </strong>
              {college.stats?.totalStudents || 0}
            </span>
          </div>
        </div>

        {/* Admin Section */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-base-content/60">
              <strong>Admin Name: </strong>
              {college.admin?.name || "Not Provided"}
            </span>
            <br />
            <span className="text-sm text-base-content/60">
              <strong>Admin Email: </strong>
              <a
                href={`mailto:${college.admin?.email}`}
                className="link link-primary"
              >
                {college.admin?.email}
              </a>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="card-actions mt-4 space-x-2">
          <button className="btn btn-secondary btn-sm">Edit</button>
          <button className="btn btn-error btn-sm">Block</button>
        </div>
      </div>
    </div>
  );
}
