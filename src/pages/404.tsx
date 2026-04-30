function main() {
  return (
    <div id='NotFound'>
      <h1>404 - Page Not Found</h1>
      <p>You seem to have gotten lost.</p>
      <button onClick={() => window.location.href = '/login'} className="Main">Go Back</button>
    </div>
  );
}
export default main