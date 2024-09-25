import { fetchScheduledEvents } from "@/repositories/professor.repository";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";
import { CreateMeetingButton } from "@/allTables/createMeetingButton";

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams?: { email?: string };
}) {
  const email = "shifashafana14@gmail.com";
  const events = await fetchScheduledEvents();

  if (!events.length) {
    return <div>No scheduled meetings found for {email}</div>;
  }

  return (
    <div className="flex h-screen flex-col bg-rose-50">
      <NavBar />
      <div className="flex flex-grow">
        <SideNav />
        <div className="flex-1 overflow-auto p-6">
          <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-rose-800">
              Scheduled Meetings for {email}
            </h1>
            <ul className="space-y-4">
              {events.map((event: any) => (
                <li
                  key={event.uri}
                  className="p-4 bg-rose-100 rounded-lg shadow-md"
                >
                  <h2 className="text-lg font-semibold text-rose-700">
                    {event.name} ({new Date(event.start_time).toLocaleString()})
                  </h2>
                  <p className="text-sm text-rose-600">
                    Duration: {event.event_type.duration} minutes
                  </p>
                  <p className="text-sm text-rose-600">
                    Invitee: {event.invitees_counter.total} people
                  </p>
                </li>
              ))}
            </ul>

            <CreateMeetingButton />
          </div>
        </div>
      </div>
    </div>
  );
}
