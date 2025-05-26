import React, { useContext, useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";

const Home = () => {
  const { token, backendUrl } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState({});
  const [weeklyData, setWeeklyData] = useState({});

  // Chart options with animations
  const chartOptions = {
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Bar chart specific options
  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    animation: {
      ...chartOptions.animation,
      onProgress: function (animation) {
        const progress = animation.currentStep / animation.numSteps;
        const ctx = animation.chart.ctx;
        ctx.save();
        ctx.fillStyle = "rgba(75, 192, 192, " + (0.3 + progress * 0.4) + ")";
      },
    },
  };

  // Pie chart specific options
  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            // console.log("Pie Chart Hover:", { label, value });
            return `${label}: ${value} orders`;
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
      animateRotate: true,
      animateScale: true,
    },
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/order/all?limit=1000`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setOrders(response.data.orders);
          processOrderData(response.data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, backendUrl]);

  const processOrderData = (ordersData) => {
    // Process category data - count total items per category
    const categoryCounts = {};
    const weeklySales = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    console.log("Processing orders data:", ordersData);

    ordersData.forEach((order) => {
      console.log("Processing order:", order._id);
      console.log("Order items:", order.items);

      // Count items and their quantities per category
      order.items.forEach((item) => {
        const category = item.category || "Uncategorized";
        const quantity = item.quantity || 1; // Default to 1 if quantity is not specified

        if (!categoryCounts[category]) {
          categoryCounts[category] = 0;
        }
        categoryCounts[category] += quantity; // Add the quantity to the category count
      });

      // Process weekly data - only count if payment > 0
      if (order.payment > 0) {
        const orderDate = new Date(order.createdAt);
        const dayOfWeek = orderDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        weeklySales[dayOfWeek] += order.payment;
      }
    });

    console.log("Final category counts:", categoryCounts);
    setCategoryData(categoryCounts);
    setWeeklyData(weeklySales);
  };

  // Prepare pie chart data
  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Items by Categories",
        data: Object.values(categoryData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
        ],
        borderWidth: 2,
        borderColor: "#fff",
        hoverBorderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };

  // Log pie chart data for debugging
  console.log("Pie Chart Data:", {
    labels: pieData.labels,
    data: pieData.datasets[0].data,
    categoryCounts: categoryData,
    totalItems: Object.values(categoryData).reduce(
      (sum, count) => sum + count,
      0
    ),
  });

  // Prepare bar chart data
  const barData = {
    labels: Object.keys(weeklyData),
    datasets: [
      {
        label: "This Week Sales (Payments)",
        data: Object.values(weeklyData),
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        borderRadius: 5,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  // Get recent sales history - only include orders with payment > 0
  const salesHistory = orders
    .filter((order) => order.payment > 0)
    .map((order) => ({
      date: new Date(order.createdAt).toLocaleDateString(),
      orderId: order._id, // Use order ID instead of items
      amount: `$${Number(order.payment).toFixed(2)}`, // Use payment amount instead of total amount
    }));

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen w-full">
      <div className="w-full max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Charts Section */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Pie Chart */}
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4">
                Items by Categories
              </h2>
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative h-[300px] w-full">
                  <Pie data={pieData} options={pieChartOptions} redraw={true} />
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4">
                This Week Sales (Payments)
              </h2>
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative h-[200px] w-full">
                  <Bar data={barData} options={barChartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Sales History Section */}
          <div className="flex-1 w-full">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 max-h-[400px] overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Payment Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesHistory.map((sale, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.date}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {sale.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
