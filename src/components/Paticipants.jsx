import React, { useEffect, useState } from "react";

const Paticipants = ({ quizId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`/api/participants/${quizId}`);
        const data = await response.json();
        setParticipants(data);
      } catch (error) {
        setError("Failed to fetch participants");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [quizId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="col-lg-12">
      <h1 className="card-title">PARTICIPANTS</h1>
      <div style={{ overflowX: "auto" }} className="col-12">
        <table className="responsive-table">
          <thead>
            <tr className="table-header">
              <th className="col col-1">Seria</th>
              <th className="col col-2 text-center">Name</th>
              <th className="col col-3">Passed</th>
              <th className="col col-3">Failed</th>
              <th className="col col-5">Points</th>
              <th className="col col-6">Grade</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr key={index} className="table-row">
                <td className="col col-1" data-label="Seria">
                  <div className="text-center">
                    <h5>{index + 1}</h5>
                  </div>
                </td>
                <td className="col col-2" data-label="Name">
                  <div className="text-center">
                    <h5>{participant.name}</h5>
                  </div>
                </td>
                <td className="col col-3" data-label="Passed">
                  <h5>{participant.passed}</h5>
                </td>
                <td className="col col-3" data-label="Failed">
                  <h5>{participant.failed}</h5>
                </td>
                <td className="col col-5" data-label="Points">
                  <h5>{participant.points}</h5>
                </td>
                <td className="col col-6" data-label="Grade">
                  <h5>{participant.grade}</h5>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Paticipants;
