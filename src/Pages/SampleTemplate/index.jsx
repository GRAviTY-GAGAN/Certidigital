import React, { useState, useEffect, useRef } from "react";
import { Form, message, Button, Table, Space, Modal, Input, Image } from "antd";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowRightOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "../../Styles/sampleTemplate.css";
import HamburgerNavbar from "../../Components/HamburgerNavbar";
import Footer from "../../Components/Footer";
import Item from "antd/es/list/Item";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const SampleTemplate = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState("");
  const [templates, setTemplates] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortedInfo, setSortedInfo] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setpageSize] = useState(5);
  const [uploadBtnLoading, setUploadingBtnLoading] = useState(false);
  const navigate = useNavigate();
  const authDetails = JSON.parse(localStorage.getItem("authDetails"));
  let token = authDetails?.token;
  const { Search } = Input;
  let debounceId;

  const handleTemplateName = (e) => {
    const { value } = e.target;
    setName(value);
  };

  const setImageFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  // Search inside Table start
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Search inside table end

  const addTemplateData = (e) => {
    setUploadingBtnLoading(true);
    console.log("file: ", file);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", name);

    fetch("https://certidigital-backend.onrender.com/template/uploadtemplate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log("data: ", data);
        message.success("Template uploaded successfully!");
        fetchTemplates();
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        message.error("Error uploading template!");
      })
      .finally(() => {
        setUploadingBtnLoading(false);
      });
  };

  // Tablesfunctions

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = () => {
    axios
      .get("https://certidigital-backend.onrender.com/template/alltemplates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res.data TEMPLATES: ", res.data);
        res.data.reverse();
        setTemplates(res.data);
        setDataSource(res.data);
      })
      .catch((err) => {
        console.log("Error:", err);
        if (err.response.data.message === "Images not found") {
          // message.warning("Template not found, Please upload one");
          setTemplates(null);
        } else {
          message.error("Error loading templates");
        }
      });
  };

  const { confirm } = Modal;

  const handleDelete = (record) => {
    confirm({
      title: "Are you sure you want to delete this template?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete(
            `https://certidigital-backend.onrender.com/template/deletetemplate/${record.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            console.log("res: ", res);
            if (res.data.message === "Error deleting image from disk") {
              message.error("Error deleting image from disk");
            } else if (res.data.message === "Image deleted successfully") {
              message.success("Template deleted successfully");
            }
            fetchTemplates();
          })
          .catch((error) => {
            console.error("Error:", error);
            message.error(error.message);
            fetchTemplates();
          });
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: "SL ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "15%",
      sorter: (a, b) => a.id - b.id,
      render: (id, record, index) => {
        ++index;
        return index;
      },
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "25%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ...getColumnSearchProps("name"),
      width: "30%",
      render: (text, record) => (
        <Link
          to={`/templatedetail/${record.id}`}
          onClick={() => localStorage.setItem("record", JSON.stringify(record))}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "TEMPLATE",
      dataIndex: "image",
      key: "image",
      align: "center",
      width: "30%",
      render: (text, record) => (
        <Image
          src={`https://certidigital-backend.onrender.com/template/singletemplate/${record.id}`}
          width={80}
          preview={{
            mask: <div style={{ background: "rgba(0, 0, 0, 0.5)" }} />,
          }}
        />
      ),
    },
    {
      title: "ACTION",
      key: "action",
      align: "center",
      width: "40%",
      render: (text, record) => (
        <Space size="middle">
          <Button
            style={{
              background: "#1F2937",
              color: "White",
            }}
            onClick={() => handleEdit(record)}
          >
            Rename
          </Button>
          <Button
            style={{
              background: "#F94A29",
              color: "White",
            }}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
          <Button type="primary" onClick={() => handleAddField(record)}>
            Add Fields
          </Button>
        </Space>
      ),
    },
  ];
  const handleAddField = (record) => {
    console.log("record: ", record);
    localStorage.setItem("record", JSON.stringify(record));
    navigate(`/sampleTemplate/${record.id}`);
  };

  // const handleDelete = (record) => {
  //   axios
  //     .delete(`https://certidigital-backend.onrender.com/template/deletetemplate/${record.id}`)
  //     .then((res) => {
  //       console.log("res: ", res);
  //       if (res.data.message === "Error deleting image from disk") {
  //         message.error("Error deleting image from disk");
  //       } else if (res.data.message === "Image deleted successfully") {
  //         message.success("Template deleted successfully");
  //       }
  //       fetchTemplates();
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       message.error(error.message);
  //       fetchTemplates();
  //     });
  // };

  const handleEdit = (record) => {
    setSelectedProduct(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.patch(
        `https://certidigital-backend.onrender.com/template/updatetemplate/${selectedProduct.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsModalVisible(false);
      message.success("Template name renamed successfully");
      fetchTemplates();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSearch = (e) => {
    if (debounceId) {
      clearTimeout(debounceId);
    }

    debounceId = setTimeout(() => {
      console.log(e.target.value, "VALUE");
      if (e.target.value.length == 0) {
        setDataSource(templates);
      } else {
        let newData = [...templates];
        let filteredTemplates = newData.filter((item) => {
          return item.name.split(" ").join("").toLowerCase().includes(value);
        });
        setDataSource(filteredTemplates);
        console.log(filteredTemplates, "FILTERDE");
      }
    }, 1000);
    let value = e.target.value.split(" ").join("").toLowerCase();
  };

  return (
    <div>
      <HamburgerNavbar />

      {/* SEPERATE SEARCH BAR IN TOP */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <h3 style={{ fontWeight: 600 }}>
          Search Template <ArrowRightOutlined />
          &nbsp;
        </h3>
        <Search
          placeholder="input search text"
          // onSearch={onSearch}
          onChange={onSearch}
          style={{
            width: 200,
          }}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
      </div> */}

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Form layout="inline" onFinish={addTemplateData}>
          <h3 style={{ marginTop: "5px" }}>
            Upload Template <ArrowRightOutlined /> &nbsp;
          </h3>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter template name",
              },
              {
                whitespace: true,
                message: "Template name cannot be empty spaces",
              },
              { min: 4, message: "name should be greater than 4 letters" },
            ]}
          >
            <Input
              className="inputBox"
              placeholder="Template Name"
              id="image-upload"
              type="text"
              onChange={handleTemplateName}
            />
          </Form.Item>
          <Form.Item
            name="image"
            rules={[
              {
                required: true,
                message: "Please select file from your computer",
              },
            ]}
          >
            <Input
              className="inputBox"
              id="image-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={setImageFile}
            />
          </Form.Item>
          <Form.Item>
            <Button loading={uploadBtnLoading} type="primary" htmlType="submit">
              Upload
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={{ marginTop: 10 }}>
        <Table
          onChange={handleTableChange}
          style={{ minHeight: "61.2vh" }}
          columns={columns}
          dataSource={dataSource}
          rowKey={(record) => record.id}
          size="small"
          pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
              setPage(page);
              setpageSize(pageSize);
            },
          }}
        ></Table>
        <Modal
          title="Edit Template Name"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter template name",
                },
                {
                  whitespace: true,
                  message: "Template name cannot be empty spaces",
                },
                { min: 4, message: "name should be greater than 4 letters" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default SampleTemplate;
