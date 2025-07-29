import { NavBarMain } from "./NavBarMain";
import { useNavBarLogic } from "./useNavBarLogic";

export const NavBarLayout = () => {
  const { session, isPending } = useNavBarLogic();

  return (
    <div className="min-w-screen bg-muted">
      <nav className="h-16 bg-background border-b">
        <NavBarMain isPending={isPending} session={session} />
      </nav>
    </div>
  );
};
