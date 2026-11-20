
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [form, setForm] = useState({
    computer_number: '',
    problem_type: '',
    severity: '',
    description: ''
  });

  const [message, setMessage] = useState('');
  const [reports, setReports] = useState([]);
  const [computers, setComputers] = useState([]);
  const [reportSearch, setReportSearch] = useState('');
  const [computerSearch, setComputerSearch] = useState('');

  const fetchReports = async () => {
    const response = await fetch('http://localhost:5000/api/reports');
    const data = await response.json();
    setReports(data);
  };

  const fetchComputers = async () => {
    const response = await fetch('http://localhost:5000/api/computers');
    const data = await response.json();
    setComputers(data);
  };

  useEffect(() => {
    fetchReports();
    fetchComputers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setForm({
          computer_number: '',
          problem_type: '',
          severity: '',
          description: ''
        });

        fetchReports();
      }
    } catch {
      setMessage('Unable to connect to the server.');
    }
  };

  // Search problem reports
  const handleSearchReports = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/reports/search?search=${encodeURIComponent(reportSearch)}`
      );

      const data = await response.json();
      setReports(data);
    } catch {
      setMessage('Unable to search reports.');
    }
  };

  // Search computer units
  const handleSearchComputers = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/computers/search?search=${encodeURIComponent(computerSearch)}`
      );

      const data = await response.json();
      setComputers(data);
    } catch {
      setMessage('Unable to search computers.');
    }
  };

  const sortData = (data, column) => {
    const severityOrder = {
      High: 1,
      Medium: 2,
      Low: 3
    };

    return [...data].sort((a, b) => {
      if (column === 'severity') {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }

      return String(a[column] ?? '').localeCompare(
        String(b[column] ?? ''),
        undefined,
        { numeric: true }
      );
    });
  };

  const sortReports = (column) => {
    setReports(sortData(reports, column));
  };

  const sortComputers = (column) => {
    setComputers(sortData(computers, column));
  };

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <span className="brand-icon">TL</span>
          <span>TechLog</span>
        </div>
        <p>Computer Problem Reporting System</p>
      </header>

      <main className="form-card">
        <div className="card-heading">
          <span className="eyebrow">TECHNICAL SUPPORT</span>
          <h1>Report a Problem</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="computer_number">Computer Number</label>
            <input
              id="computer_number"
              name="computer_number"
              placeholder="e.g. PC-12"
              value={form.computer_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="problem_type">Problem Type</label>
              <select
                id="problem_type"
                name="problem_type"
                value={form.problem_type}
                onChange={handleChange}
                required
              >
                <option value="">Choose problem type</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="severity">Severity Level</label>
              <select
                id="severity"
                name="severity"
                value={form.severity}
                onChange={handleChange}
                required
              >
                <option value="">Choose severity</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="description">Problem Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the problem you encountered..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Submit Report →</button>
        </form>

        {message && <div className="message">{message}</div>}

        <div className="card-footer">
          Please provide accurate information about the issue.
        </div>
      </main>

      <section className="table-section">
        <div className="table-heading">
          <h2>Computer Problem Reports</h2>
          <p>Click a column heading to sort.</p>
        </div>

        <form className="search-form" onSubmit={handleSearchReports}>
          <input
            className="search-input"
            type="text"
            placeholder="Search problem reports..."
            value={reportSearch}
            onChange={(e) => setReportSearch(e.target.value)}
          />
          <button className="search-button" type="submit">
            Search
          </button>
        </form>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                {[
                  ['id', 'ID'],
                  ['computer_number', 'Computer No.'],
                  ['problem_type', 'Problem Type'],
                  ['severity', 'Severity'],
                  ['description', 'Description'],
                  ['status', 'Status'],
                  ['date_reported', 'Date Reported']
                ].map(([column, label]) => (
                  <th key={column}>
                    <button
                      className="sort-button"
                      onClick={() => sortReports(column)}
                    >
                      {label} ↕
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.computer_number}</td>
                  <td>{report.problem_type}</td>
                  <td>{report.severity}</td>
                  <td>{report.description}</td>
                  <td>{report.status}</td>
                  <td>{new Date(report.date_reported).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {reports.length === 0 && (
            <p className="empty-message">No reports found.</p>
          )}
        </div>
      </section>

      <section className="table-section">
        <div className="table-heading">
          <h2>Computer Units</h2>
          <p>Click a column heading to sort.</p>
        </div>

        <form className="search-form" onSubmit={handleSearchComputers}>
          <input
            className="search-input"
            type="text"
            placeholder="Search computer units..."
            value={computerSearch}
            onChange={(e) => setComputerSearch(e.target.value)}
          />
          <button className="search-button" type="submit">
            Search
          </button>
        </form>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                {[
                  ['id', 'ID'],
                  ['computer_number', 'Computer No.'],
                  ['laboratory', 'Laboratory'],
                  ['status', 'Status']
                ].map(([column, label]) => (
                  <th key={column}>
                    <button
                      className="sort-button"
                      onClick={() => sortComputers(column)}
                    >
                      {label} ↕
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {computers.map((computer) => (
                <tr key={computer.id}>
                  <td>{computer.id}</td>
                  <td>{computer.computer_number}</td>
                  <td>{computer.laboratory}</td>
                  <td>{computer.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {computers.length === 0 && (
            <p className="empty-message">No computer units found.</p>
          )}
        </div>
      </section>

      <footer className="page-footer">
        TechLog · Computer Laboratory Support
      </footer>
    </div>
  );
}

export default App;
