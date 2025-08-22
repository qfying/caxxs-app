import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CardItem {
  name: string;
  time: string;
  status: string;
  company: string;
  lacate: string;
  id: number;
  customer: string;
  start: string;
  address: string;
  // 根据实际数据结构添加其他字段
  [key: string]: any;
}

interface UserInfo {
  user_id: string;
  name: string;
  age: string;
  role: string;
  work_experience_years: string;
  experience_level: string;
  primary_domains: string;
  equipment_familiarity: string;
  communication_style: string;
}

interface UserState {
  userId: string | null;
  token: string | null;
  selectCardItem: CardItem | null;
  userInfo: UserInfo | null;
  databaseList: any[] | null;
  setUser: (userId: string, token: string) => void;
  clearUser: () => void;
  setSelectCardItem: (item: CardItem | null) => void;
  clearSelectCardItem: () => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setDatabaseList: (databaseList: any[] | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      token: null,
      selectCardItem: null,
      userInfo: null,
      databaseList: null,
      setUser: (userId: string, token: string) => set({ userId, token }),
      clearUser: () => set({ userId: null, token: null }),
      setSelectCardItem: (item: CardItem | null) => set({ selectCardItem: item }),
      clearSelectCardItem: () => set({ selectCardItem: null }),
      setUserInfo: (userInfo: UserInfo | null) => set({ userInfo }),
      setDatabaseList: (databaseList: any | null) => set({ databaseList }),
    }),
    {
      name: 'user-store', // localStorage 的 key
      partialize: (state) => ({
        // 只持久化需要的状态
        userId: state.userId,
        token: state.token,
        selectCardItem: state.selectCardItem,
        userInfo: state.userInfo,
        databaseList: state.databaseList,
      }),
    }
  )
);
