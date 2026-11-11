const TableHeader = () => {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-4 py-3">
          Event date
        </th>
        <th scope="col" className="px-4 py-3">
          Event type
        </th>
        <th scope="col" className="px-4 py-3">
          Aircraft registration
        </th>
        <th scope="col" className="px-4 py-3">
          Aircraft type
        </th>
        <th scope="col" className="px-4 py-3">
          Pilot in command
        </th>
        <th scope="col" className="px-4 py-3">
          Departure
        </th>
        <th scope="col" className="px-4 py-3">
          Destination
        </th>
        <th scope="col" className="px-4 py-3">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
