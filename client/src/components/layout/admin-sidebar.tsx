import { useTranslation } from "react-i18next";
import { Link } from "wouter";

export default function AdminSidebar({ activeItem, onItemClick }: { activeItem: string, onItemClick: (item: string) => void }) {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', label: t('admin.dashboard'), icon: '📊' },
    { id: 'users', label: t('admin.users'), icon: '👥' },
    { id: 'withdrawals', label: t('admin.withdrawals'), icon: '💰' },
    { id: 'content', label: t('admin.content'), icon: '📝' }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 h-screen overflow-y-auto fixed left-0 top-16 p-4 border-r border-gray-200 dark:border-gray-700">
      <nav>
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onItemClick(item.id)}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                  activeItem === item.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}