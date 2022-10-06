const Contato = require("../models/ContatoModel");

exports.index = (req, res) => {
  res.render("contato");
};

exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    await contato.addContact(req.session.user._id);

    if (contato.errors.length > 0) {
      req.flash("errors", contato.errors);
      req.session.save(() => res.redirect("/contato/index"));
      return;
    }

    req.flash("success", "Contato cadastrado com sucesso!");
    req.session.user = contato.user;
    req.session.save(() => res.redirect(`/index/${req.session.user._id}`));
    return;
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.editIndex = async function (req, res) {
  try {
    const contato = req.session.user.contatos[req.params.index];
    res.render("contato", { contato });
  } catch {
    console.log(e);
    return res.render("404");
  }
};

exports.edit = async function (req, res) {
  try {
    const contato = new Contato(req.body);
    await contato.editaContato(req.params.index);

    if (contato.errors.length > 0) {
      req.flash("errors", contato.errors);
      req.session.save(() => res.redirect(`/contato/index/${req.params.id}`));
      return;
    }

    req.flash("success", "Contato editado com sucesso!");

    req.session.user = contato.user;

    req.session.save(() => res.redirect(`/contato/index/${req.params.id}`));

    return;
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

exports.delete = async function (req, res) {
  if (!req.params.id) return res.render("404");

  const contato = await Contato.delete(req.params.id);

  if (!contato) return res.render("404");

  req.flash("success", "Contato apagado com sucesso!");
  req.session.save(() => res.redirect(`/`));
  return;
};
