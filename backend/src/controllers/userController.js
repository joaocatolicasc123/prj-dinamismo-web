
const API_URL = "https://jsonplaceholder.typicode.com/users";

export async function getUsers(req, res) {
  try {
    const { id } = req.params;

    const urlGet = `${API_URL}${id ? `/${id}` : ""}`;
    const response = await fetch(urlGet);

    if (!response.ok)
      return res
        .status(response.status)
        .json({ message: `Erro HTTP na API externa.` });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Operação getUsers falhou: ${error}`);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function createUser(req, res) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok)
      return res
        .status(response.status)
        .json({ message: `Erro HTTP na API externa.` });

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error(`Operação createUser falhou: ${error}`);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const putUrl = `${API_URL}/${id}`;

    const response = await fetch(putUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok)
      return res
        .status(response.status)
        .json({ message: `Erro HTTP na API externa.` });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Operação updateUser falhou: ${error}`);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deleteUrl = `${API_URL}/${id}`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      return res
        .status(response.status)
        .json({ message: `Erro HTTP na API externa.` });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Operação deleteUser falhou: ${error}`);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
