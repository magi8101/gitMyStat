import RepoList from "@/utils/repositories";
import { NextResponse } from "next/server";

// /recent/link?username=magi8101
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.redirect("https://github.com");
  }

  try {
    const rawdata = await RepoList(username);

    // Check if user has repositories
    if (
      rawdata.data?.user?.repositories?.edges &&
      rawdata.data.user.repositories.edges.length > 0
    ) {
      const recentRepo = rawdata.data.user.repositories.edges[0].node;
      const repoUrl = recentRepo.url;
      
      // Redirect to the repository URL
      return NextResponse.redirect(repoUrl);
    }

    // Fallback to user profile if no repos
    return NextResponse.redirect(`https://github.com/${username}`);
  } catch (error) {
    // On error, redirect to user profile
    return NextResponse.redirect(`https://github.com/${username}`);
  }
}
