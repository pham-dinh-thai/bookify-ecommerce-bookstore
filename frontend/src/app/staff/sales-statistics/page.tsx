'use client';

import { useState } from 'react';
import {
  PaymentChannel,
  SalesPeriod,
  SalesTrendPoint,
  TopSellingBook,
} from './types';
import { salesPeriodOptions, salesPeriodSelections } from './period-options';
import useSalesStatistics from './hooks/use-sales-statistics';

const formatVnd = (value: number) =>
  Number(value).toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + ' VNĐ';

const formatCompactVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value) + 'đ';

export default function StaffSalesStatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<SalesPeriod>('month');
  const [selectedSelection, setSelectedSelection] = useState(
    salesPeriodSelections.month[0].value,
  );
  const selectionOptions = salesPeriodSelections[selectedPeriod];
  const selectedLabel =
    selectionOptions.find((option) => option.value === selectedSelection)
      ?.label ?? selectionOptions[0].label;
  const { statistics, loading, error } = useSalesStatistics(
    selectedPeriod,
    selectedSelection,
  );
  const maxRevenue = Math.max(
    0,
    ...(statistics?.trend ?? []).map((point) => point.revenue),
  );
  const totalChannelRevenue = (statistics?.paymentChannels ?? []).reduce(
    (sum, channel) => sum + channel.revenue,
    0,
  );
  const totalCategoryRevenue = (statistics?.categories ?? []).reduce(
    (sum, category) => sum + category.revenue,
    0,
  );

  const summaryCards = [
    {
      label: 'Total Revenue',
      value: formatVnd(statistics?.summary.revenue ?? 0),
      change: statistics?.summary.revenueGrowth ?? 0,
      className: 'bg-[#eef8f1] text-[#2d6a4f]',
    },
    {
      label: 'Orders',
      value: (statistics?.summary.orders ?? 0).toLocaleString('vi-VN'),
      change: statistics?.summary.orderGrowth ?? 0,
      className: 'bg-[#eef6ff] text-[#204877]',
    },
    {
      label: 'Books Sold',
      value: (statistics?.summary.booksSold ?? 0).toLocaleString('vi-VN'),
      change: statistics?.summary.booksSoldGrowth ?? 0,
      className: 'bg-[#fff8e6] text-[#7a5800]',
    },
    {
      label: 'Average Order Value',
      value: formatVnd(statistics?.summary.averageOrderValue ?? 0),
      change: statistics?.summary.averageOrderValueGrowth ?? 0,
      className: 'bg-[#f4f0ff] text-[#5b21b6]',
    },
  ];

  return (
    <div className="p-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#6d7f72]">
            {statistics?.periodLabel ?? selectedLabel}
          </p>
          <h2
            className="text-5xl font-extrabold tracking-tighter leading-[1.1]"
            style={{ color: '#2b352f' }}
          >
            <span className="italic" style={{ color: '#335b48' }}>
              Sales Statistics
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="inline-flex rounded-2xl border border-[#dce7de] bg-white p-1 shadow-sm">
            {salesPeriodOptions.map((option) => {
              const isActive = option.value === selectedPeriod;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(option.value);
                    setSelectedSelection(
                      salesPeriodSelections[option.value][0].value,
                    );
                  }}
                  className={`h-10 rounded-xl px-4 text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-[#2d6a4f] text-white shadow-sm'
                      : 'text-[#55735f] hover:bg-[#f0f7f3]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <label className="sr-only" htmlFor="sales-period-selection">
            Select report period
          </label>
          <select
            id="sales-period-selection"
            value={selectedSelection}
            onChange={(event) => setSelectedSelection(event.target.value)}
            className="h-12 rounded-2xl border border-[#dce7de] bg-white px-4 text-sm font-bold text-[#22352b] shadow-sm outline-none transition-colors hover:bg-[#f7faf5] focus:border-[#2d6a4f]"
          >
            {selectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Unable to load sales statistics from the backend.
        </div>
      ) : null}

      {loading && !statistics ? (
        <div className="mb-6 rounded-2xl border border-[#e8ede9] bg-white px-4 py-3 text-sm font-medium text-[#55735f]">
          Loading sales statistics...
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <section className="rounded-2xl border border-[#e8ede9] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#6d7f72]">
                Revenue Trend
              </h3>
            </div>
            <div className="rounded-full bg-[#eef8f1] px-3 py-1.5 text-sm font-bold text-[#2d6a4f]">
              +{statistics?.summary.revenueGrowth ?? 0}%
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex min-w-[760px] items-end gap-3 border-b border-[#e8ede9] pb-4">
              {statistics?.trend.length ? (
                statistics.trend.map((point) => (
                  <TrendBar
                    key={point.label}
                    point={point}
                    height={
                      maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0
                    }
                  />
                ))
              ) : (
                <EmptyPanel text="No revenue data for this period." />
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e8ede9] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#6d7f72]">
              Payment Channels
            </h3>
          </div>

          <div className="space-y-4">
            {statistics?.paymentChannels.length ? (
              statistics.paymentChannels.map((channel) => (
                <PaymentChannelRow
                  key={channel.name}
                  channel={channel}
                  totalRevenue={totalChannelRevenue}
                />
              ))
            ) : (
              <EmptyPanel text="No payment data for this period." />
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <section className="rounded-2xl border border-[#e8ede9] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#6d7f72]">
              Category Revenue
            </h3>
          </div>

          <div className="space-y-3">
            {statistics?.categories.length ? (
              statistics.categories.map((category) => {
                const percentage =
                  totalCategoryRevenue > 0
                    ? (category.revenue / totalCategoryRevenue) * 100
                    : 0;

                return (
                  <div key={category.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-[#22352b]">
                        {category.name}
                      </span>
                      <span className="text-[#6d7f72]">
                        {formatCompactVnd(category.revenue)}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#f1f5ef]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#7b8d80]">
                      {category.units.toLocaleString('vi-VN')} books sold
                    </p>
                  </div>
                );
              })
            ) : (
              <EmptyPanel text="No category data for this period." />
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e8ede9] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#6d7f72]">
                Top Selling Books
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#eef2ea]">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[3rem_1fr_7rem_10rem_7rem] gap-4 bg-[#f7faf5] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6d7f72]">
                <span>#</span>
                <span>Book</span>
                <span>Units</span>
                <span>Revenue</span>
                <span>Growth</span>
              </div>

              {statistics?.topSellingBooks.length ? (
                statistics.topSellingBooks.map((book, index) => (
                  <TopSellingBookRow
                    key={book.id}
                    book={book}
                    rank={index + 1}
                  />
                ))
              ) : (
                <div className="border-t border-[#eef2ea] px-4 py-5">
                  <EmptyPanel text="No book sales for this period." />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="w-full rounded-xl bg-[#f7faf5] px-4 py-5 text-sm font-medium text-[#6d7f72]">
      {text}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  change,
  className,
}: {
  label: string;
  value: string;
  change: number;
  className: string;
}) {
  return (
    <div className={`rounded-2xl p-6 ${className}`}>
      <div className="mb-5 text-sm font-bold uppercase tracking-wide">
        {label}
      </div>
      <p className="break-words text-3xl font-extrabold leading-tight">
        {value}
      </p>
      <p className="mt-3 text-sm font-bold">{change}% vs previous period</p>
    </div>
  );
}

function TrendBar({
  point,
  height,
}: {
  point: SalesTrendPoint;
  height: number;
}) {
  return (
    <div className="flex h-72 w-10 shrink-0 flex-col items-center justify-end gap-2">
      <div className="flex flex-1 items-end">
        <div
          title={`${point.label}: ${formatVnd(point.revenue)}`}
          className="w-10 rounded-t-xl bg-[#2d6a4f] transition-colors hover:bg-[#1f513b]"
          style={{ height: `${Math.max(height, 8)}%` }}
        />
      </div>
      <p className="text-center text-[11px] font-semibold leading-tight text-[#7b8d80]">
        {point.label.replace(' ', '\n')}
      </p>
      <p className="text-[11px] font-bold text-[#22352b]">{point.orders}</p>
    </div>
  );
}

function PaymentChannelRow({
  channel,
  totalRevenue,
}: {
  channel: PaymentChannel;
  totalRevenue: number;
}) {
  const percentage =
    totalRevenue > 0 ? (channel.revenue / totalRevenue) * 100 : 0;

  return (
    <div className="rounded-xl border border-[#eef2ea] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-[#22352b]">{channel.name}</p>
          <p className="text-sm font-medium text-[#7b8d80]">
            {channel.orders.toLocaleString('vi-VN')} orders
          </p>
        </div>
        <span className="text-sm font-extrabold text-[#22352b]">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="mb-2 h-2.5 rounded-full bg-[#f1f5ef]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: channel.color,
          }}
        />
      </div>
      <p className="text-sm font-bold text-[#405a4a]">
        {formatVnd(channel.revenue)}
      </p>
    </div>
  );
}

function TopSellingBookRow({
  book,
  rank,
}: {
  book: TopSellingBook;
  rank: number;
}) {
  return (
    <div className="grid grid-cols-[3rem_1fr_7rem_10rem_7rem] gap-4 border-t border-[#eef2ea] px-4 py-3 text-sm text-[#405a4a]">
      <span className="font-extrabold text-[#2d6a4f]">{rank}</span>
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#22352b]">{book.title}</p>
        <p className="truncate text-xs text-[#7b8d80]">{book.author}</p>
      </div>
      <span className="font-semibold">
        {book.units.toLocaleString('vi-VN')}
      </span>
      <span className="font-semibold text-[#22352b]">
        {formatVnd(book.revenue)}
      </span>
      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#eef8f1] px-2.5 py-0.5 text-xs font-bold text-[#2d6a4f]">
        {book.growth}%
      </span>
    </div>
  );
}
