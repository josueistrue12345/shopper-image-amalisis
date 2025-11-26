import 'package:uuid/uuid.dart';
import '../type_evidence_model.dart';

class FormModel {
  String? id;
  String? title;
  String? subtitle;
  String? comment;
  String? category;
  double? latitude;
  double? longitude;
  bool? enable;
  String? createdAt;
  String? status;
  List<Area>? areas;
  List<Dependent>? dependencies;
  List<TypeOfEvidence>? attachedFiles;
  TypeOfEvidence? responseSignature;
  String? startTime;
  String? autor;
  String? duration;
  List<String>? deptos;
  List<String>? unityTypes;
  List<String>? users;
  String? checkApply;
  String? userApply;
  String? unityToApply;
  String? dateApplyed;
  bool? visibility;
  bool? isSelected;
  String? nameApplyUser;
  String? nameApplyUnity;
  String? nameApplyUnityType;
  String? nameApplyUnityAddress;
  String? nameApplyUnityRegion;
  String? dateSync;
  String? dateAprove;
  String? dateReprove;
  String? dateApplyedUser;
  String? dateFinished;
  String? platform;
  FormSettings? config;
  List<String?>? clasifications;
  

  FormModel({
    this.id,
    this.title,
    this.subtitle,
    this.comment,
    this.category,
    this.latitude,
    this.longitude,
    this.enable,
    this.createdAt,
    this.status = 'Activo',
    this.areas,
    this.dependencies,
    this.attachedFiles,
    this.responseSignature,
    this.startTime,
    this.autor,
    this.deptos,
    this.unityTypes,
    this.users,
    this.checkApply,
    this.userApply,
    this.unityToApply,
    this.dateApplyed,
    this.duration,
    this.visibility = true,
    this.isSelected = false,
    this.nameApplyUser,
    this.nameApplyUnity,
    this.nameApplyUnityType,
    this.nameApplyUnityRegion,
    this.nameApplyUnityAddress,
    this.dateAprove,
    this.dateReprove,
    this.dateApplyedUser,
    this.dateSync,
    this.dateFinished,
    this.platform,
    this.config,
    this.clasifications
  });

  factory FormModel.fromJson(Map<String, dynamic> json) {
    List<dynamic> areasJson = json['areas'] ?? [];
    List<Area>? areasList = areasJson.isNotEmpty
        ? areasJson.map((areaJson) => Area.fromJson(areaJson)).toList()
        : null;

    List<dynamic> dependentJson = json['dependencies'] ?? [];
    List<Dependent>? dependentList = dependentJson.isNotEmpty
        ? dependentJson.map((depJson) => Dependent.fromJson(depJson as Map<String, dynamic>)).toList()
        : null;

    List<dynamic> evidences = json['attachedFiles'] ?? [];
    List<TypeOfEvidence>? evidenceList = evidences.isNotEmpty
        ? evidences.map((evidence) => TypeOfEvidence.fromJson(evidence as Map<String, dynamic>)).toList()
        : null;

    String parseUserApply(dynamic userApply) {

        if (userApply is String) {
          return userApply;
        } else if (userApply is Map<String, dynamic>?) {
          String name = userApply?['name'] ?? '';
          String faLastName = userApply?['faLastName'] ?? '';
          String moLastName = userApply?['moLastName'] ?? '';
        return '$name $faLastName $moLastName'.trim();
      }
      return 'Desconocido';
    }

    String parseAutorName (dynamic autor) {
      if (autor is String) {
        return autor;
      } else if (autor is Map<String, dynamic>?) {
        String name = autor?['name'] ?? '';
        String faLastName = autor?['faLastName'] ?? '';
        String moLastName = autor?['moLastName'] ?? '';
        return '$name $faLastName $moLastName'.trim();
      }
      return 'Desconocido';
    }
    
    String parseUnityToApply (dynamic unityToApply) {
      if (unityToApply is String) {
        return unityToApply;
      } else if (unityToApply is Map<String, dynamic>) {
        return unityToApply['name'] ?? 'Desconocido';
      }
      return 'Desconocido';
    }

    String parseUnityToApplyType (dynamic unityToApply) {
      if (unityToApply is String) {
        return unityToApply;
      } else if (unityToApply is Map<String, dynamic>) {
        if (unityToApply.containsKey('typeUnity') && unityToApply['typeUnity'] is Map<String, dynamic>) {
          return unityToApply['typeUnity']?['name'] ?? 'Desconocido';
        }
      }
      return 'Desconocido';
    }

    String parseUnityToApplyRegion (dynamic unityToApply) {
      if (unityToApply is String) {
        return unityToApply;
      } else if (unityToApply is Map<String, dynamic>) {
        if (unityToApply.containsKey('regionGroup') && unityToApply['regionGroup'] is Map<String, dynamic>) {
          return unityToApply['regionGroup']?['name'] ?? 'Desconocido';
        }
      }
      return 'Desconocido';
    }

    return FormModel(
      id: json['_id']?.toString(),
      title: json['title'] as String?,
      subtitle: json['subtitle'] ?? "",
      comment: json['comment'] ?? "Ninguno",
      category: json['category'] ?? 'N/A',
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
      enable: json['enable'] as bool?,
      createdAt: json['createdAt'] as String?,
      status: json['status'] as String?,
      attachedFiles: evidenceList ?? [],
      responseSignature: json['responseSignature'] != null ? TypeOfEvidence.fromJson(json['responseSignature']) : null,
      startTime: json['startTime'] as String?,
      autor: parseAutorName(json['autor']),
      areas: areasList ?? [],
      dependencies: dependentList ?? [],
      deptos: (json['deptos'] as List<dynamic>?)?.cast<String>(),
      unityTypes: (json['unityTypes'] as List<dynamic>?)?.cast<String>(),
      users: (json['users'] as List<dynamic>?)?.cast<String>(),
      checkApply: json['checkApply'] is String? json['checkApply'] : 'Desconocido',
      userApply: parseUserApply(json['userApply']),
      unityToApply: parseUnityToApply(json['unityToApply']),
      nameApplyUnityType: parseUnityToApplyType(json['unityToApply']),
      nameApplyUnityRegion: parseUnityToApplyRegion(json['unityToApply']),
      // nameApplyUnityAddress: parseUnityToApplyAddress(json['unityToApply']),
      dateApplyed: json['dateApplyed'] as String?,
      visibility: json['visibility'] as bool?,
      duration: json['duration'] as String?,
      dateAprove: json['dateAprove'] as String?,
      dateReprove: json['dateReprove'] as String?,
      dateApplyedUser: json['dateApplyedUser'] as String?,
      dateSync: json['dateSync'] as String?,
      dateFinished: json['dateFinished'] as String?,
      platform: json['platform'] ?? 'Android',
      config: json['config'] != null ? FormSettings.fromJson(json['config']) : null,
      clasifications: (json['clasifications'] as List<dynamic>?)?.cast<String?>(),
    );
  }

  Map<String, dynamic> toJson() {
    List<Map<String, dynamic>> areasList = areas?.map((area) => area.toJson()).toList() ?? [];
    List<Map<String, dynamic>> dependenciesList = dependencies?.map((dependent) => dependent.toJson()).toList() ?? [];

    return {
      'title': title?.toUpperCase(),
      'subtitle': subtitle,
      'comment': comment,
      'category': category,
      'latitude': latitude,
      'longitude': longitude,
      'enable': enable,
      'createdAt': createdAt,
      'status': status,
      'areas': areasList,
      'dependencies': dependenciesList,
      'attachedFiles': attachedFiles,
      'responseSignature': responseSignature?.toJson(),
      'startTime': startTime,
      'autor': autor,
      'deptos': deptos,
      'unityTypes': unityTypes,
      'users': users,
      'checkApply': checkApply,
      'userApply': userApply,
      'unityToApply': unityToApply,
      'nameApplyUnityType': nameApplyUnityType,
      'nameApplyUnityRegion': nameApplyUnityRegion,
      'dateApplyed': dateApplyed,
      'visibility': visibility,
      'duration': duration,
      'dateAprove': dateAprove,
      'dateReprove': dateReprove,
      'dateApplyedUser': dateApplyedUser,
      'dateSync': dateSync,
      'dateFinished': dateFinished,
      "platform": platform,
      'config': config?.toJson(),
      'clasifications': clasifications,
    };
  }
}

class FormSettings {
  PonderationConfig? ponderationConfig;
  NotificationSetting? notificationSetting;
  InformSetting? informSetting;
  FillSetting? fillSetting;
  AnalizeSetting? analizeSetting;
  AfterApplySetting? afterApplySetting;
  

  FormSettings({
    this.notificationSetting, this.informSetting, this.fillSetting, this.analizeSetting, this.afterApplySetting, this.ponderationConfig});

  factory FormSettings.fromJson(Map<String, dynamic> json) {
    return FormSettings(
      notificationSetting: json['notificationSetting'] != null ? NotificationSetting.fromJson(json['notificationSetting'] as Map<String, dynamic>) : null,
      informSetting: json['informSetting'] != null ? InformSetting.fromJson(json['informSetting'] as Map<String, dynamic>) : null,
      fillSetting: json['fillSetting'] != null ? FillSetting.fromJson(json['fillSetting'] as Map<String, dynamic>) : null,
      analizeSetting: json['analizeSetting'] != null ? AnalizeSetting.fromJson(json['analizeSetting'] as Map<String, dynamic>) : null,
      afterApplySetting: json['afterApplySetting'] != null ? AfterApplySetting.fromJson(json['afterApplySetting'] as Map<String, dynamic>) : null,
      ponderationConfig: json['ponderationConfig'] != null ? PonderationConfig.fromJson(json['ponderationConfig'] as Map<String, dynamic>) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'notificationSetting': notificationSetting?.toJson(),
      'informSetting': informSetting?.toJson(),
      'fillSetting': fillSetting?.toJson(),
      'analizeSetting': analizeSetting?.toJson(),
      'afterApplySetting': afterApplySetting?.toJson(),
      'ponderationConfig': ponderationConfig?.toJson(),
    };
  }
}

class NotificationSetting {
  bool? unityReceiveEmailFromReply;
  bool? unityReceiveCopyFromActiveProgrammingFromThis;
  bool? userReceiveEmailFromFinishReply;
  

  NotificationSetting({
    this.unityReceiveEmailFromReply,this.unityReceiveCopyFromActiveProgrammingFromThis,this.userReceiveEmailFromFinishReply});

  factory NotificationSetting.fromJson(Map<String, dynamic> json) {
    return NotificationSetting(
      unityReceiveEmailFromReply: json['unityReceiveEmailFromReply'] as bool?,
      unityReceiveCopyFromActiveProgrammingFromThis: json['unityReceiveCopyFromActiveProgrammingFromThis'] as bool?,
      userReceiveEmailFromFinishReply: json['userReceiveEmailFromFinishReply'] as bool?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'unityReceiveEmailFromReply': unityReceiveEmailFromReply,
      'unityReceiveCopyFromActiveProgrammingFromThis': unityReceiveCopyFromActiveProgrammingFromThis,
      'userReceiveEmailFromFinishReply': userReceiveEmailFromFinishReply
    };
  }
}

class InformSetting {
  bool? isCustomScale;
  double? na;
  double? bad;
  double? normal;
  double? good;
  double? excellent;
  double? no;
  double? yes;
  

  InformSetting({
    this.isCustomScale, this.na, this.bad, this.normal, this.good, this.excellent,this.no, this.yes });

  factory InformSetting.fromJson(Map<String, dynamic> json) {
    return InformSetting(
      isCustomScale: json['isCustomScale'] as bool?,
      na: json['na']?.toDouble(),
      bad: json['bad']?.toDouble(),
      normal: json['normal']?.toDouble(),
      good: json['good']?.toDouble(),
      excellent: json['excellent']?.toDouble(),
      no: json['no']?.toDouble(),
      yes: json['yes']?.toDouble()
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'isCustomScale': isCustomScale,
      'na': na,
      'bad': bad,
      'normal': normal,
      'good': good,
      'excellent': excellent,
      'no': no,
      'yes': yes,
    };
  }
}

class FillSetting {
  bool? allowAttachedFilesFromDevice;
  bool? shareChecklistBySpecialEmail;
  bool? allowAddGeneralCommentOnFinish;
  

  FillSetting({
    this.allowAttachedFilesFromDevice,this.shareChecklistBySpecialEmail,this.allowAddGeneralCommentOnFinish});

  factory FillSetting.fromJson(Map<String, dynamic> json) {
    return FillSetting(
      allowAttachedFilesFromDevice: json['allowAttachedFilesFromDevice'] as bool?,
      shareChecklistBySpecialEmail: json['shareChecklistBySpecialEmail'] as bool?,
      allowAddGeneralCommentOnFinish: json['allowAddGeneralCommentOnFinish'] as bool?
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'allowAttachedFilesFromDevice': allowAttachedFilesFromDevice,
      'shareChecklistBySpecialEmail': shareChecklistBySpecialEmail,
      'allowAddGeneralCommentOnFinish': allowAddGeneralCommentOnFinish  
    };
  }
}

class AnalizeSetting {
  bool? canBeAnalized;
  bool? isAprove;
  List<String>? usersAllowed;
  

  AnalizeSetting({
    this.canBeAnalized = false, this.isAprove = false, this.usersAllowed});

  factory AnalizeSetting.fromJson(Map<String, dynamic> json) {
    return AnalizeSetting(
      canBeAnalized: json['canBeAnalized'] as bool?,
      isAprove: json['isAprove'] as bool?,
      usersAllowed: (json['usersAllowed'] as List<dynamic>?)?.cast<String>()
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'canBeAnalized': canBeAnalized,
      'isAprove': isAprove,
      'usersAllowed': usersAllowed
    };
  }
}

class AfterApplySetting {
  bool? canBeCommentedAfterFinished;
  bool? canBeReopenedAfterFinished;
  

  AfterApplySetting({
    this.canBeCommentedAfterFinished,this.canBeReopenedAfterFinished});

  factory AfterApplySetting.fromJson(Map<String, dynamic> json) {
    return AfterApplySetting(
      canBeCommentedAfterFinished: json['canBeCommentedAfterFinished'] as bool?,
      canBeReopenedAfterFinished: json['canBeReopenedAfterFinished'] as bool?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'canBeCommentedAfterFinished': canBeCommentedAfterFinished,
      'canBeReopenedAfterFinished': canBeReopenedAfterFinished
    };
  }
}

class PonderationConfig {
  
  String? clasification;
  double? puntuation;
  double? clasify1Value;
  double? clasify2Value;
  double? clasify3Value;
  double? clasify4Value;

  PonderationConfig({
    this.clasification,
    this.puntuation,
    this.clasify1Value,
    this.clasify2Value,
    this.clasify3Value,
    this.clasify4Value
  });

  factory PonderationConfig.fromJson(Map<String, dynamic> json) {
    return PonderationConfig(
      clasification: json['clasification'] as String?,
      puntuation: json['puntuation']?.toDouble(),
      clasify1Value: json['clasify1Value']?.toDouble(),
      clasify2Value: json['clasify2Value']?.toDouble(),
      clasify3Value: json['clasify3Value']?.toDouble(),
      clasify4Value: json['clasify4Value']?.toDouble()
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'clasification': clasification,
      'puntuation': puntuation,
      'clasify1Value': clasify1Value,
      'clasify2Value': clasify2Value,
      'clasify3Value': clasify3Value,
      'clasify4Value': clasify4Value
    };
  }
}

class Area {
  String? id;
  String? name;
  String? description;
  List<Item>? items;
  List<TypeOfEvidence>? attachedFiles;
  double? partialValue;
  double? variation;
  bool? toSaved;
  bool? isSelected;
  String? clasification;

  Area({
    this.id,
    this.name,
    this.description,
    this.items,
    this.attachedFiles,
    this.partialValue,
    this.variation,
    this.isSelected = false,
    this.toSaved = false,
    this.clasification,
  });

  factory Area.fromJson(Map<String, dynamic> json) {
    List<dynamic> itemsJson = json['items'] ?? [];
    List<Item> itemsList = itemsJson.map((itemJson) => Item.fromJson(itemJson)).toList();

    List<dynamic> evidences = json['attachedFiles'] ?? [];
    List<TypeOfEvidence>? evidenceList = evidences.isNotEmpty
        ? evidences.map((evidence) => TypeOfEvidence.fromJson(evidence as Map<String, dynamic>)).toList()
        : null;

    return Area(
      id: json['id'] as String?,
      name: json['name'] as String?,
      description: json['description'] as String?,
      attachedFiles: evidenceList,
      items: itemsList,
      clasification: json['clasification'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    List<Map<String, dynamic>> itemsList = items?.map((item) =>
          item.toJson()).toList() ?? [];
    return {
      'id': id,
      'name': name,
      'description': description,
      'items': itemsList,
      'attachedFiles': attachedFiles,
      'partialValue': partialValue,
      'variation': variation,
      'clasification': clasification,
    };
  }
}

  List<String> parseDetonantSelected(dynamic value) {
      if (value is List<dynamic>) {
        return value.whereType<String>().cast<String>().toList();
      } else if (value is String) {
        return [value];
      } else {
        return [];
      }
    }

class Dependent {
  String? id;
  List<String>? nameOptionSelected;
  bool? isAnswered;
  Item dependentWith;
  List<Item>? attachmentDependencies;

  Dependent({
    String? id,
    required this.nameOptionSelected,
    required this.dependentWith,
    required this.attachmentDependencies,
    this.isAnswered = false,
  }) : id = id ?? const Uuid().v4();

  factory Dependent.fromJson(Map<String, dynamic> json) {
    List<dynamic> dependenciesJson = json['attachmentDependencies'] ?? [];
    List<Item> dependencies = dependenciesJson.map((itemJson) => Item.fromJson(itemJson)).toList();

    return Dependent(
      id: json['id'] as String?,
      nameOptionSelected:  parseDetonantSelected(json['nameOptionSelected']),
      isAnswered: json['isAnswered'] as bool? ?? false,
      dependentWith: Item.fromJson(json['dependentWith'] as Map<String, dynamic>),
      attachmentDependencies: dependencies,
    );
  }

  Map<String, dynamic> toJson() {
    List<Map<String, dynamic>> dependencies = attachmentDependencies?.map((item) => item.toJson()).toList() ?? [];

    return {
      'id': id,
      'nameOptionSelected': nameOptionSelected,
      'isAnswered': isAnswered,
      'dependentWith': dependentWith.toJson(),
      'attachmentDependencies': dependencies,
    };
  }
}

class Item {
  String? id;
  String? description;
  double? peso;
  List<Complemento>? complements;
  String? type;
  OptionResponses? response;
  bool? isAprove;
  bool? isRequired;
  List<TypeOfEvidence>? annexes;
  bool? isSelected; 
  bool? onSave;
  List<EvidenceType>? evidences;
  List<Complemento>? optionalComplements;
  String? clasification;
  bool? isLarge;

  Item({
    this.description,
    this.peso,
    this.complements,
    this.id,
    this.type,
    this.response,
    this.isAprove,
    this.isRequired,
    this.isSelected = false,
    this.annexes,
    this.onSave = false,
    this.evidences,
    this.optionalComplements,
    this.clasification,
    this.isLarge = false,
  });

  factory Item.fromJson(Map<String, dynamic> json) {
    List<dynamic> complementsJson = json['complements'] ?? [];
    List<Complemento>? complementsList = complementsJson.isNotEmpty
        ? complementsJson.map((complementJson) => Complemento.fromJson(complementJson)).toList()
        : [];

    List<dynamic> requiredComplements = json['optionalComplements'] ?? [];
    List<Complemento>? complementsRequired = requiredComplements.isNotEmpty
        ? requiredComplements.map((ok) => Complemento.fromJson(ok)).toList()
        : [];

    List<dynamic> evidences = json['annexes'] ?? [];
    List<TypeOfEvidence>? evidenceList = evidences.isNotEmpty
        ? evidences.map((evidence) => TypeOfEvidence.fromJson(evidence as Map<String, dynamic>)).toList()
        : null;

    return Item(
      id: json['id'] as String?,
      description: json['description'] as String?,
      peso: json['peso']?.toDouble(),
      isAprove: json['isAprove'] as bool?,
      isRequired: json['isRequired'] as bool?,
      complements: complementsList,
      type: json['type'],
      response: OptionResponses.fromJson(json['response'] ?? {}),
      annexes: evidenceList,
      optionalComplements: complementsRequired,
      clasification: json['clasification'] as String?,
      isLarge: json['isLarge'] as bool?
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'description': description,
      'peso': peso,
      'type': type ?? 'Texto',
      'complements': complements,
      'isRequired': isRequired,
      'isAprove': isAprove ?? false,
      'response': response?.toJson(),
      'annexes': annexes,
      'optionalComplements': optionalComplements,
      'clasification': clasification,
      'isLarge': isLarge,
    };
  }
}

class Complemento {
  String? id;
  String? nombre;
  String? type;
  bool? enable;
  List<TypeOfEvidence>? evidences;
  String? comment;

  Complemento({
    this.id,
    this.nombre,
    this.type,
    this.enable,
    this.evidences,
    this.comment
  });

  factory Complemento.fromJson(Map<String, dynamic> json) {
    List<TypeOfEvidence> evidences = [];

    if (json['evidences'] != null) {
      if (json['evidences'] is List) {
        evidences.addAll((json['evidences'] as List)
            .map((e) => TypeOfEvidence.fromJson(e))
            .toList());
      } else if (json['evidences'] is Map<String, dynamic>) {
        evidences.add(TypeOfEvidence.fromJson(json['evidences']));
      }
    }

    void addIfNotNull(Map<String, dynamic>? source) {
      if (source != null && source['path'] != null  && source['path'] != "") {
        TypeOfEvidence evidence = TypeOfEvidence.fromJson(source);
        if (!evidences.contains(evidence)) {
          evidences.add(evidence);
        }
      }
    }

     addIfNotNull(json['signSource'] as Map<String, dynamic>?);
    json['keySource'] is List 
    ? addIfNotNull(json['keySource'][0] as Map<String, dynamic>?) : 
    addIfNotNull(json['keySource'] as Map<String, dynamic>?);

    return Complemento(
      id: json['id'] as String?,
      nombre: json['nombre'] as String?,
      type: json['type'] as String?,
      enable: json['enable'] as bool?,
      evidences: evidences,
      comment: json['comment'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    List<Map<String, dynamic>> evidenceList =
        evidences?.map((e) => e.toJson()).toList() ?? [];

    Map<String, dynamic>? signSource;
    Map<String, dynamic>? keySource;

    for (var evidence in evidences ?? []) {
      if (evidence.type == "signSource") {
        signSource = evidence.toJson();
      }
      if (evidence.type == "keySource") {
        keySource = evidence.toJson();
      }
    }

    return {
      'id': id,
      'nombre': nombre,
      'type': type,
      'enable': enable,
      'evidences': evidenceList.isNotEmpty ? evidenceList : null,
      'signSource': signSource,
      'keySource': keySource,
      'comment': comment
    };
  }
}


class OptionResponses {
  String? id;
  String? type;
  String? generalResponse;
  List<EvaluationRankOption>? evaluativeOptions;
  List<SubItemCheck>? subItemChecks;
  List<SelectListModel>? listSelected;

  OptionResponses({
    this.id,
    this.type,
    this.generalResponse,
    this.evaluativeOptions,
    this.subItemChecks,
    this.listSelected,
  });

  factory OptionResponses.fromJson(Map<String, dynamic> json) {
    List<dynamic> evaluativeOptionsJson = json['evaluativeOptions'] ?? [];
    List<EvaluationRankOption>? evaluativeOptionsList = evaluativeOptionsJson.isNotEmpty
        ? evaluativeOptionsJson.map((optionJson) => EvaluationRankOption.fromJson(optionJson)).toList()
        : null;

    List<dynamic> subItemChecksJson = json['subItemChecks'] ?? [];
    List<SubItemCheck>? subItemChecksList = subItemChecksJson.isNotEmpty
        ? subItemChecksJson.map((checkJson) => SubItemCheck.fromJson(checkJson)).toList()
        : null;

    List<dynamic> listSelectedJson = json['listSelected'] ?? [];
    List<SelectListModel>? listSelectedItems = listSelectedJson.isNotEmpty
        ? listSelectedJson.map((listSelected) => SelectListModel.fromJson(listSelected)).toList()
        : null;

    return OptionResponses(
      id: json['id'] as String?,
      type: json['type'] as String?,
      generalResponse: json['generalResponse'] as String?,
      evaluativeOptions: evaluativeOptionsList,
      subItemChecks: subItemChecksList,
      listSelected: listSelectedItems,
    );
  }

  Map<String, dynamic> toJson() {
    List<Map<String, dynamic>> evaluativeOptionsJson = evaluativeOptions?.map((option) => option.toJson()).toList() ?? [];
    List<Map<String, dynamic>> subItemChecksJson = subItemChecks?.map((check) => check.toJson()).toList() ?? [];
    List<Map<String, dynamic>> listSelectedJson = listSelected?.map((list) => list.toJson()).toList() ?? [];

    return {
      'id': id,
      'type': type,
      'generalResponse': generalResponse,
      'evaluativeOptions': evaluativeOptionsJson,
      'subItemChecks': subItemChecksJson,
      'listSelected': listSelectedJson,
    };
  }
}

class EvaluationRankOption {
  String? id;
  String? name;
  bool? isSelected;
  List<Complemento>? complements;

  EvaluationRankOption({
    this.id,
    this.name,
    this.isSelected,
    this.complements,
  });

  factory EvaluationRankOption.fromJson(Map<String, dynamic> json) {
    List<dynamic> complementsJson = json['complements'] ?? [];
    List<Complemento>? complementsList = complementsJson.isNotEmpty
        ? complementsJson.map((complementJson) => Complemento.fromJson(complementJson)).toList()
        : null;

    return EvaluationRankOption(
      id: json['id'] as String?,
      name: json['name'] as String?,
      isSelected: json['isSelected'] as bool?,
      complements: complementsList,
    );
  }

  Map<String, dynamic> toJson() {
    List<Map<String, dynamic>> complementsJson = complements?.map((complement) => complement.toJson()).toList() ?? [];

    return {
      'id': id,
      'name': name,
      'isSelected': isSelected,
      'complements': complementsJson,
    };
  }
}

class SelectListModel {
  String? id;
  String? name;
  bool? isSelected;
  bool? isMulti;
  List<Complemento>? complements;
  double? partialPercent;
  double? givedPercent;

  SelectListModel({
    this.id,
    this.name,
    this.isSelected,
    this.complements,
    this.partialPercent,
    this.givedPercent,
    this.isMulti = false,
  });

  factory SelectListModel.fromJson(Map<String, dynamic> json) {
    List<dynamic> complementsJson = json['complements'] ?? [];
    List<Complemento>? complementsList = complementsJson.isNotEmpty
        ? complementsJson.map((complementJson) => Complemento.fromJson(complementJson)).toList()
        : null;

    return SelectListModel(
      id: json['id'] as String?,
      name: json['name'] as String?,
      isSelected: json['isSelected'] as bool?,
      isMulti: json['isMulti'] as bool?,
      complements: complementsList,
      partialPercent: json['partialPercent'] as double?,
      givedPercent: json['givedPercent'] as double?,
    );
  }

  Map<String, dynamic> toJson() {
    List<Map<String, dynamic>> complementsJson = complements?.map((complement) => complement.toJson()).toList() ?? [];

    return {
      'id': id,
      'name': name,
      'isSelected': isSelected,
      'complements': complementsJson,
      'partialPercent': partialPercent,
      'givedPercent': givedPercent,
      'isMulti': isMulti,
    };
  }
}

class SubItemCheck {
  String? id;
  String? description;
  bool? enable;

  SubItemCheck({
    this.id,
    this.description,
    this.enable,
  });

  factory SubItemCheck.fromJson(Map<String, dynamic> json) {
    return SubItemCheck(
      id: json['id'] as String?,
      description: json['description'] as String?,
      enable: json['enable'] as bool?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'description': description,
      'enable': enable,
    };
  }
}


class EvidenceType {
  List<String>? url;
  String? name;
  String? description;
  int? type;
  EvidenceType({this.url, this.type, this.name, this.description});
}