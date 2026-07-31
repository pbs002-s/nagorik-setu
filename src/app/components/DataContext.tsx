import { createContext, useContext, useState, type ReactNode } from "react";
import {
  DISCUSSIONS, SUGGESTIONS, POLLS, SERVICES, DISCUSSION_COMMENTS,
  type Discussion, type Suggestion, type Poll, type Service, type DiscussionComment,
} from "../data/mockData";

interface DataCtx {
  discussions: Discussion[];
  setDiscussions: (d: Discussion[]) => void;
  suggestions: Suggestion[];
  setSuggestions: (s: Suggestion[]) => void;
  polls: Poll[];
  setPolls: (p: Poll[]) => void;
  services: Service[];
  setServices: (s: Service[]) => void;
  discussionComments: DiscussionComment[];
  addDiscussionComment: (c: DiscussionComment) => void;
  likedDiscussionIds: Set<string>;
  toggleDiscussionLike: (discussionId: string) => void;
}

const Ctx = createContext<DataCtx>({
  discussions: DISCUSSIONS,
  setDiscussions: () => {},
  suggestions: SUGGESTIONS,
  setSuggestions: () => {},
  polls: POLLS,
  setPolls: () => {},
  services: SERVICES,
  setServices: () => {},
  discussionComments: DISCUSSION_COMMENTS,
  addDiscussionComment: () => {},
  likedDiscussionIds: new Set(),
  toggleDiscussionLike: () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [discussions, setDiscussions] = useState<Discussion[]>(DISCUSSIONS);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(SUGGESTIONS);
  const [polls, setPolls] = useState<Poll[]>(POLLS);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [discussionComments, setDiscussionComments] = useState<DiscussionComment[]>(DISCUSSION_COMMENTS);
  const [likedDiscussionIds, setLikedDiscussionIds] = useState<Set<string>>(new Set());

  const addDiscussionComment = (c: DiscussionComment) => {
    setDiscussionComments((prev) => [...prev, c]);
    setDiscussions((prev) => prev.map((d) => d.id === c.discussionId ? { ...d, comments: d.comments + 1 } : d));
  };

  const toggleDiscussionLike = (discussionId: string) => {
    setLikedDiscussionIds((prev) => {
      const next = new Set(prev);
      const alreadyLiked = next.has(discussionId);
      if (alreadyLiked) next.delete(discussionId); else next.add(discussionId);
      setDiscussions((ds) => ds.map((d) => d.id === discussionId ? { ...d, likes: d.likes + (alreadyLiked ? -1 : 1) } : d));
      return next;
    });
  };

  return (
    <Ctx.Provider value={{
      discussions, setDiscussions, suggestions, setSuggestions, polls, setPolls, services, setServices,
      discussionComments, addDiscussionComment, likedDiscussionIds, toggleDiscussionLike,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useData() {
  return useContext(Ctx);
}
