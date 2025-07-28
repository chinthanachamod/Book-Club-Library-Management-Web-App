import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

interface StatsCardProps {
    title: string;
    value: number;
    change: number;
    icon: string;
}

export default function StatsCard({ title, value, change, icon }: StatsCardProps) {
    const isPositive = change >= 0;

    return (
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3 text-white">
                    {/* Simple icon placeholder */}
                    <span className="text-xl">{icon === 'book' ? '📚' :
                        icon === 'check' ? '✓' :
                            icon === 'people' ? '👥' :
                                '⚠️'}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
                    <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{value}</div>
                        {change !== 0 && (
                            <div
                                className={`ml-2 flex items-baseline text-sm font-semibold ${
                                    isPositive ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {isPositive ? (
                                    <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" />
                                ) : (
                                    <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" />
                                )}
                                <span className="sr-only">{isPositive ? 'Increased' : 'Decreased'} by</span>
                                {Math.abs(change)}%
                            </div>
                        )}
                    </dd>
                </div>
            </div>
        </div>
    );
}