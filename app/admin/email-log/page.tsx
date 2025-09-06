"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminLayout } from "@/components/admin-layout";
import {
  CalendarIcon,
  Mail,
  RefreshCw,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  getNotificationLogs,
  getNotificationStats,
  NotificationLog,
} from "../email-notifications/actions";
import { NotificationType } from "@/app/generated/prisma";

const notificationTypes = [
  {
    value: "SCHEDULE" as NotificationType,
    label: "Schedule Update",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "REMINDER" as NotificationType,
    label: "Reminder",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "CHANGE" as NotificationType,
    label: "Schedule Change",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "EMERGENCY" as NotificationType,
    label: "Emergency",
    color: "bg-red-100 text-red-800",
  },
];

const statusOptions = [
  { value: "sent", label: "Sent", icon: CheckCircle, color: "text-green-600" },
  { value: "failed", label: "Failed", icon: XCircle, color: "text-red-600" },
  { value: "pending", label: "Pending", icon: Clock, color: "text-yellow-600" },
];

export default function EmailLogPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    sent: number;
    failed: number;
    pending: number;
    recentActivity: number;
    byType?: Record<NotificationType, number>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Filter state
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    faculty: "",
    department: "",
    level: "",
    dateFrom: "",
    dateTo: "",
  });

  // Load logs and stats on component mount and filter changes
  useEffect(() => {
    loadLogs();
  }, [filters, currentPage]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const result = await getNotificationLogs({
        ...filters,
        type:
          filters.type !== "all"
            ? (filters.type as NotificationType)
            : undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });

      if (result.success && result.data) {
        setLogs(result.data);
        setTotalCount(result.total || 0);
      }
    } catch (error) {
      console.error("Failed to load logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async (): Promise<void> => {
    try {
      const result = await getNotificationStats();

      if (result.success && result.data) {
        // pick only the fields your state expects
        const { total, sent, failed, pending, recentActivity } = result.data;
        setStats({ total, sent, failed, pending, recentActivity });
      } else {
        // optional: clear stats when there's no data
        setStats(null);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
      // optional: clear stats on error
      setStats(null);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      status: "",
      faculty: "",
      department: "",
      level: "",
      dateFrom: "",
      dateTo: "",
    });
    setCurrentPage(1);
  };

  const getNotificationTypeData = (type: NotificationType) => {
    return (
      notificationTypes.find((t) => t.value === type) || notificationTypes[0]
    );
  };

  const getStatusData = (status: string) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[2];
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not sent";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Email Notification Logs</h1>
              <p className="text-sm text-muted-foreground">
                View and manage email notification history
              </p>
            </div>
          </div>
          <Button onClick={loadLogs} disabled={isLoading} variant="outline">
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </header>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Emails</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.sent}</p>
                  <p className="text-sm text-muted-foreground">Sent</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.failed}</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h3 className="font-medium">Filters</h3>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-sm">Date From</Label>
              <div className="flex items-center gap-2 border p-2 rounded-md">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                  className="border-0 p-0 focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Date To</Label>
              <div className="flex items-center gap-2 border p-2 rounded-md">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="border-0 p-0 focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Other Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select
              onValueChange={(value) => handleFilterChange("type", value)}
              value={filters.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => handleFilterChange("status", value)}
              value={filters.status}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Faculty"
              value={filters.faculty}
              onChange={(e) => handleFilterChange("faculty", e.target.value)}
            />

            <Input
              placeholder="Department"
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
            />

            <Input
              placeholder="Level"
              value={filters.level}
              onChange={(e) => handleFilterChange("level", e.target.value)}
            />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} -{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
              notifications
            </p>
            <Button variant="outline" onClick={clearFilters} size="sm">
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Logs */}
        <Card>
          <div className="p-6">
            <h3 className="font-medium mb-4">Notification History</h3>

            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Loading...
                </div>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  No email notifications found matching the selected filters.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => {
                  const typeData = getNotificationTypeData(log.type);
                  const statusData = getStatusData(log.status);
                  const StatusIcon = statusData.icon;

                  return (
                    <div
                      key={log.id}
                      className="bg-muted/30 p-4 rounded-lg border hover:border-primary/20 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={typeData.color}
                              variant="secondary"
                            >
                              {typeData.label}
                            </Badge>
                            <div
                              className={`flex items-center gap-1 ${statusData.color}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              <span className="text-xs font-medium">
                                {statusData.label}
                              </span>
                            </div>
                          </div>

                          <h4 className="font-medium text-sm mb-1">
                            {log.subject}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            To: {log.recipientName} ({log.recipientEmail})
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {log.message}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-muted-foreground mb-1">
                            Created: {formatDate(log.createdAt)}
                          </p>
                          {log.sentAt && (
                            <p className="text-xs text-muted-foreground">
                              Sent: {formatDate(log.sentAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </main>
    </AdminLayout>
  );
}
