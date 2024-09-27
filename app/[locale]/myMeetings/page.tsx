import { fetchScheduledEvents } from "@/repositories/professor.repository";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";
import { CreateMeetingButton } from "@/allTables/createMeetingButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import MeetingButtons from "@/allTables/MeetingButton";
import RefreshOnMount from "@/allTables/refreshOnMount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MeetingsPage() {
  const session = await getServerSession(authOptions);
  const allEvents = await fetchScheduledEvents(session?.user.email || "");
  const email = session?.user.email;

  // Filter out cancelled meetings
  const events = allEvents.filter((event: any) => event.status !== "canceled");

  return (
    <div className="flex h-screen flex-col bg-rose-50">
      <RefreshOnMount />

      {/* Sticky NavBar */}
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Sticky SideNav */}
        <div className="sticky top-16 z-10">
          <SideNav />
        </div>

        <main className="flex-1 overflow-auto p-6">
          <Card className="container mx-auto bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-rose-800">
                {events.length > 0
                  ? "Active Scheduled Meetings"
                  : "No Active Meetings"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center">
                  <p className="text-lg text-rose-600 mb-6">
                    It looks like you dont have any upcoming active meetings.
                    <br />
                    Schedule one now to get started!
                  </p>
                  <CreateMeetingButton />
                </div>
              ) : (
                <>
                  <ul className="space-y-4">
                    {events.map((event: any) => (
                      <li
                        key={event.uri}
                        className="p-4 bg-rose-100 rounded-lg shadow-md"
                      >
                        <h2 className="text-lg font-semibold text-rose-700">
                          {event.name} (
                          {new Date(event.start_time).toLocaleString()})
                        </h2>
                        <p className="text-sm text-rose-600">
                          Duration: {event.event_type.duration} minutes
                        </p>
                        <p className="text-sm text-rose-600">
                          Invitee: {event.invitees_counter.total} people
                        </p>
                        <p className="text-sm text-rose-600">
                          Status: {event.status}
                        </p>
                        <div className="mt-2">
                          <MeetingButtons
                            email={email || ""}
                            joinUrl={event.location.join_url}
                            rescheduleUrl={event.reschedule_url}
                            eventUuid={event.uri.split("/").pop()}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <CreateMeetingButton />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
